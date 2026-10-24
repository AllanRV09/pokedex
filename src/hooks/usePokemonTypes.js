import { useEffect, useState } from "react"

export default function usePokemonTypes({ setError }) {
  const [types, setTypes] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(true)

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
      .finally(() => { if (!controller.signal.aborted) setLoadingTypes(false) })

    return () => controller.abort()
  }, [setError])

  return { types, loadingTypes }
}