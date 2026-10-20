import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"

function App() {
  const [pokemon, setPokemon] = useState([])

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
      .then(res => res.json())
      .then(data => setPokemon(data.results))
  }, [])

  return (
    <main>
      <section className="pokemon-list">
        {pokemon.map(poke => <PokemonCard key={poke.name} pokemon={poke} />)}
      </section>
    </main>
  )
}

export default App
