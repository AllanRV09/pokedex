import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"
import PokemonCardSkeleton from "./components/skeletons/PokemonCardSkeleton"
import NavBar from "./components/NavBar"
import TypesFilter from "./components/TypesFilter"
import OrderBy from "./components/OrderBy"
import { HiXMark } from "react-icons/hi2";

const PAGE_SIZE = 20

function App() {
  const [pokemon, setPokemon] = useState([])
  const [pokemonFilteredByType, setPokemonFilteredByType] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [types, setTypes] = useState([])
  const [typeFilter, setTypeFilter] = useState([])
  const [orderBy, setOrderBy] = useState("initial-value")

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

  useEffect(() => {
    const controller = new AbortController()
    fetch("https://pokeapi.co/api/v2/type/", { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`)
        }

        return res.json()
      })
      .then(data => {
        return (
          fetch(`https://pokeapi.co/api/v2/type/?limit=${data.count}`, { signal: controller.signal })
            .then(res => {
              if (!res.ok) {
                throw new Error(`Response status: ${res.status}`);
              }

              return res.json()
            })
            .then(data => setTypes(data.results.filter(type => !["stellar", "unknown", "shadow"].includes(type.name))))
        )
      })
      .catch((e) => {
        if (e.name === "AbortError") return
        console.error("Error:", e)
        setError("Unable to load Pokémon types. Please try again later.")
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    if (typeFilter.length === 0) return

    if (typeFilter.length === 1) {
      fetch(`https://pokeapi.co/api/v2/type/${typeFilter[0]}/`, { signal: controller.signal })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
          }

          return res.json()
        })
        .then(data => {
          const newData = data.pokemon.map(poke => poke.pokemon)

          return setPokemonFilteredByType(newData)
        })
        .catch((e) => {
          if (e.name === "AbortError") return
          console.error("Error:", e)
          setError("Unable to load Pokémon by types. Please try again later.")
        })
    }

    if (typeFilter.length === 2) {
      async function handleTypesFilter() {
        try {
          const result = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/type/${typeFilter[0]}/`, { signal: controller.signal })
              .then(res => {
                if (!res.ok) {
                  throw new Error(`Response status: ${res.status}`);
                }

                return res.json()
              }),
            fetch(`https://pokeapi.co/api/v2/type/${typeFilter[1]}/`, { signal: controller.signal })
              .then(res => {
                if (!res.ok) {
                  throw new Error(`Response status: ${res.status}`);
                }

                return res.json()
              })
          ])

          const intersection = result[0].pokemon.filter(type => result[1].pokemon.some(poke => poke.pokemon.name === type.pokemon.name))

          const newData = intersection.map(data => data.pokemon)

          return setPokemonFilteredByType(newData)
        } catch (e) {
          if (e.name === "AbortError") return
          console.error("Error: ", e)
          setError("Unable to load Pokémon by types. Please try again later.")
        }
      }

      handleTypesFilter()
    }

    return () => controller.abort()
  }, [typeFilter])

  const isNumber = (str) => {
    if (typeof str !== 'string') return false;
    return str.trim() !== '' && Number.isFinite(Number(str));
  }

  function getPokemonId(pokemon) {
    const urlSplit = pokemon.url.split("/")

    const idPokemon = urlSplit[urlSplit.length - 2]

    return parseInt(idPokemon)
  }

  const pokemonToFilter = typeFilter.length > 0 ?
    pokemonFilteredByType :
    pokemon

  const filteredPokemon = pokemonToFilter.filter(poke => {
    const pokemonId = getPokemonId(poke)

    if (isNumber(search)) {
      return pokemonId === parseInt(search.trim())
    }

    return poke.name.includes(search.trim().toLocaleLowerCase())
  })

  function getOrderedPokemon(filteredPokemon) {
    switch (orderBy) {
      case "initial-value":
        return filteredPokemon
      case "id-asc":
        return [...filteredPokemon].sort((a, b) => getPokemonId(a) - getPokemonId(b))
      case "id-desc":
        return [...filteredPokemon].sort((a, b) => getPokemonId(b) - getPokemonId(a))
      case "name-asc":
        return [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return [...filteredPokemon].sort((a, b) => b.name.localeCompare(a.name))
    }
  }

  const filteredPokemonOrdered = getOrderedPokemon(filteredPokemon)

  const numberPages = Math.ceil(filteredPokemonOrdered.length / PAGE_SIZE)

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
  const visiblePokemon = filteredPokemonOrdered.slice(startIndex, startIndex + PAGE_SIZE)

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
          ) : search !== "" && filteredPokemonOrdered.length === 0 ? (
            <p>No Pokémon found. Try a different search!</p>
          ) : (
            visiblePokemon.map(poke =>
              <PokemonCard key={poke.name} pokemon={poke} />
            )
          )
        }
      </section>
    )

    function handleClearFilters() {
      setSearch("")
      setTypeFilter([])
      setCurrentPage(1)
    }

  return (
    <>
      <header>
        <NavBar search={search} onSearchChange={handleSearchChange} />
      </header>
      <main>
        <h2>Discover All Pokémon</h2>
        <p>Explore the Pokédex and learn about Pokémon from every generation.</p>
        <div className="filters">
          <fieldset className="filter-types">
            <div className="filter-types__options">
              {types.map(type => (
                <TypesFilter
                  key={type.name}
                  types={type}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  setCurrentPage={setCurrentPage}
                />
              ))}
            </div>
          </fieldset>

          <div className="filter-actions">
            {(search.trim() !== "" || typeFilter.length > 0) && <button onClick={handleClearFilters}>
              <HiXMark size={23} />
              Clear filters
            </button>}

            <OrderBy
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
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
