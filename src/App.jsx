import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"

function App() {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
      .then(res => {
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => setPokemon(data.results))
      .catch((e) => {
        console.error("Error:", e)
        setError("Unable to load Pokémon. Please try again later.")
      })
      .finally(() => setLoading(false))
  }, [])

  const pokemonContent =
    loading ? (
      <p>Loading Pokémon...</p>
    ) : error !== "" ? (
      <p>{error}</p>
    ) : pokemon.length === 0 ? (
      <p>No Pokémon found.</p>
    ) : (
      <section className="pokemon-list">
        {pokemon.map(poke =>
          <PokemonCard key={poke.name} pokemon={poke} />
        )}
      </section>
    )

  return (
    <main>
      {pokemonContent}
    </main>
  )
}

export default App
