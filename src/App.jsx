import { useState } from "react"
import NavBar from "./components/NavBar"
import Pagination from "./components/Pagination"
import PokemonResults from "./components/PokemonResults"
import usePokemon from "./hooks/usePokemon";
import usePokemonByTypes from "./hooks/usePokemonByTypes";
import usePokemonTypes from "./hooks/usePokemonTypes";
import Filters from "./components/Filters";

const PAGE_SIZE = 20

function App() {
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState([])
  const [orderBy, setOrderBy] = useState("initial-value")

  const { pokemon, loading } = usePokemon({ PAGE_SIZE, setError })

  function handleSearchChange(value) {
    setSearch(value)
    setCurrentPage(1)
  }

  const { pokemonFilteredByType, loadingByType, setLoadingByType } = usePokemonByTypes({ typeFilter, setError })

  const { types } = usePokemonTypes({ setError })

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

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visiblePokemon = filteredPokemonOrdered.slice(startIndex, startIndex + PAGE_SIZE)

  const isPokemonListEmpty = !loading && pokemon.length === 0
  const hasNoResults = filteredPokemonOrdered.length === 0 && !loading && !loadingByType

  function handleClearFilters() {
    setSearch("")
    setTypeFilter([])
    setCurrentPage(1)
    setLoadingByType(false)
  }

  return (
    <>
      <header>
        <NavBar search={search} onSearchChange={handleSearchChange} />
      </header>
      <main>
        <h2>Discover All Pokémon</h2>
        <p>Explore the Pokédex and learn about Pokémon from every generation.</p>

        <Filters
          types={types}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          setCurrentPage={setCurrentPage}
          search={search}
          handleClearFilters={handleClearFilters}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          setLoadingByType={setLoadingByType}
        />

        <PokemonResults
          error={error}
          loading={loading || loadingByType}
          isPokemonListEmpty={isPokemonListEmpty}
          pageSize={PAGE_SIZE}
          hasNoResults={hasNoResults}
          visiblePokemon={visiblePokemon}
        />

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numberPages={numberPages}
        />
      </main>
    </>
  )
}

export default App
