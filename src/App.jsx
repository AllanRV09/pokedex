import PokemonDetails from "./pages/PokemonDetails";
import PokemonList from "./pages/PokemonList"
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokemonList />} />
      <Route path="pokemon/:pokemonId" element={<PokemonDetails />} />
      <Route path="*" element={<PokemonList />} />
    </Routes>
  )
}

export default App
