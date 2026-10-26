import { useEffect, useState } from "react"

export default function usePokemonSpecies(props) {
    const [description, setDescription] = useState("")
    const [errorSpecies, setErrorSpecies] = useState("")
    const [loadingSpecies, setLoadingSpecies] = useState(true)
    const [evolutionChainUrl, setEvolutionChainUrl] = useState("")

    const pokemonId = props

    useEffect(() => {
        if (!pokemonId) return
        
        const controller = new AbortController()
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                }

                return res.json()
            })
            .then(data => {
                const englishEntry = data.flavor_text_entries.find(
                    flavor => flavor.language.name === "en"
                )

                if (englishEntry) {
                    setDescription(englishEntry.flavor_text.replace(/\f/g, " "))
                }

                setEvolutionChainUrl(data.evolution_chain.url)
            })
            .catch((e) => {
                if (e.name === "AbortError") return

                console.error("Error: ", e)
                setErrorSpecies("Failed to load Pokémon details.")
            })
            .finally(() => { if (!controller.signal.aborted) setLoadingSpecies(false) })

        return () => controller.abort()
    }, [pokemonId])

    return { description, evolutionChainUrl, loadingSpecies, errorSpecies }
}