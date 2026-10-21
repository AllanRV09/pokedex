import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"
import PokemonCardSkeleton from "./components/skeletons/PokemonCardSkeleton"
import NavBar from "./components/NavBar"

const PAGE_SIZE = 20

function App() {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  function handleSearchChange(value) {
    setSearch(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        return (
          fetch(`https://pokeapi.co/api/v2/pokemon?limit=${data.count}`, { signal: controller.signal })
            .then(res => {
              if (!res.ok) {
                throw new Error(`Response status: ${res.status}`)
              }

              return res.json()
            })
            .then(data => setPokemon(data.results))
        )
      })
      .catch((e) => {
        if (e.name === "AbortError") return
        console.error("Error:", e)
        setError("Unable to load Pokémon. Please try again later.")
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })

    return () => controller.abort()
  }, [])

  const isNumber = (str) => {
    if (typeof str !== 'string') return false;
    return str.trim() !== '' && Number.isFinite(Number(str));
  }

  const filteredPokemon = pokemon.filter(poke => {
    const pokemonUrlSplited = poke.url.split("/")
    const lastPokemonUrlSplited = pokemonUrlSplited[pokemonUrlSplited.length - 2]

    if (isNumber(search)) {
      return lastPokemonUrlSplited === search.trim()
    }

    return poke.name.includes(search.trim().toLocaleLowerCase())
  })

  const numberPages = Math.ceil(filteredPokemon.length / PAGE_SIZE)

  const pageItems = (() => {
    if (numberPages <= 5) {
      return Array.from({ length: numberPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis-end", numberPages]
    }

    if (currentPage >= numberPages - 2) {
      return [1, "ellipsis-start", numberPages - 2, numberPages - 1, numberPages]
    }

    return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", numberPages]
  })()

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visiblePokemon = filteredPokemon.slice(startIndex, startIndex + PAGE_SIZE)

  const pokemonContent =
    error !== "" ? (
      <p>{error}</p>
    ) : !loading && pokemon.length === 0 ? (
      <p>No Pokémon found.</p>
    ) : (
      <section className="pokemon-list">
        {
          loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <article key={index} className="pokemon-card">
                <PokemonCardSkeleton />
              </article>
            ))
          ) : search !== "" && filteredPokemon.length === 0 ? (
            <p>No Pokémon found. Try a different search!</p>
          ) : (
            visiblePokemon.map(poke =>
              <PokemonCard key={poke.name} pokemon={poke} />
            )
          )
        }
      </section>
    )

  return (
    <>
      <header>
        <NavBar search={search} onSearchChange={handleSearchChange} />
      </header>
      <main>
        {pokemonContent}
        {numberPages > 1 && (
          <nav className="pagination" aria-label="Pokemon pagination">
            <button
              type="button"
              className="pagination-button"
              onClick={() => setCurrentPage(page => page - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {pageItems.map((item, index) => (
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  className={`pagination-button${currentPage === item ? " active" : ""}`}
                  aria-current={currentPage === item ? "page" : undefined}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </button>
              ) : (
                <span key={`${item}-${index}`} className="pagination-ellipsis" aria-hidden="true">
                  ...
                </span>
              )
            ))}

            <button
              type="button"
              className="pagination-button"
              onClick={() => setCurrentPage(page => page + 1)}
              disabled={currentPage === numberPages}
            >
              Next
            </button>
          </nav>
        )}
      </main>
    </>
  )
}

export default App
