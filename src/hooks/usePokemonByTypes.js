import { useEffect, useState } from "react";

export default function usePokemonByTypes({ typeFilter, setError }) {
    const [pokemonFilteredByType, setPokemonFilteredByType] = useState([])
    const [loadingByType, setLoadingByType] = useState(false)
    
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
            .finally(() => { if (!controller.signal.aborted) setLoadingByType(false) })
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
            } finally {
              if (!controller.signal.aborted) setLoadingByType(false)
            }
          }
    
          handleTypesFilter()
        }
    
        return () => controller.abort()
      }, [typeFilter, setError])

      return { pokemonFilteredByType, loadingByType, setLoadingByType }
}