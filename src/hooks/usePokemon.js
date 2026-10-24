import { useEffect, useState } from "react";

export default function usePokemon({ PAGE_SIZE, setError }) {
    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(true)

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
      }, [PAGE_SIZE, setError])

      return { pokemon, loading }
}