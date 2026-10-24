import { useEffect, useState } from "react"

export default function usePokemonDetails(url) {
    const [pokemonDetails, setPokemonDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()
        fetch(url, { signal: controller.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                }

                return res.json()
            })
            .then(data => setPokemonDetails(data))
            .catch((e) => {
                if(e.name === "AbortError") return

                console.error("Error: ", e)
                setError("Failed to load Pokémon details.")
            })
            .finally(() => { if (!controller.signal.aborted) setLoading(false) })

        return () => controller.abort()
    }, [url])

    return { pokemonDetails, loading, error }
}