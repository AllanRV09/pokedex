import { useEffect, useState } from "react"
import { GiDna1 } from "react-icons/gi"
import { Link } from "react-router"
import usePokemonDetails from "../hooks/usePokemonDetails"

function getPokemonId(speciesUrl) {
    const parts = speciesUrl.split("/").filter(Boolean)
    return Number(parts.at(-1))
}

function EvolutionPokemon({ species }) {
    const pokemonId = getPokemonId(species.url)
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    const { pokemonDetails, loading, error } = usePokemonDetails(pokemonUrl)

    if (loading) return <p className="evolution-pokemon__status">Loading {species.name}...</p>
    if (error) return <p className="evolution-pokemon__status" role="alert">Could not load {species.name}.</p>

    const image = pokemonDetails.sprites?.other?.["official-artwork"]?.front_default

    return (
        <Link
            className="evolution-pokemon__link"
            to={`/pokemon/${pokemonId}`}
            aria-label={`View ${species.name} details`}
        >
            <article className="evolution-pokemon">
                {image && (
                    <img src={image} alt={`Official artwork of ${species.name}`} />
                )}
                <h3>{species.name}</h3>
                <span>#{String(pokemonId).padStart(3, "0")}</span>
            </article>
        </Link>
    )
}

function hasBranches(stage) {
    const nextStages = stage.evolves_to ?? []
    return nextStages.length > 1 || nextStages.some(hasBranches)
}

function getLinearEvolution(stage) {
    const species = []
    let currentStage = stage

    while (currentStage) {
        species.push(currentStage.species)
        currentStage = currentStage.evolves_to?.[0] ?? null
    }

    return species
}

function EvolutionTree({ stage }) {
    const nextStages = stage.evolves_to ?? []

    return (
        <div className="evolution-tree">
            <EvolutionPokemon species={stage.species} />

            {nextStages.length > 0 && (
                <div className="evolution-tree__children">
                    {nextStages.map(nextStage => (
                        <div className="evolution-tree__branch" key={nextStage.species.name}>
                            <span className="evolution-arrow" aria-hidden="true">→</span>
                            <EvolutionTree stage={nextStage} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function PokemonEvolution({ evolutionChainUrl }) {
    const [evolutionChain, setEvolutionChain] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!evolutionChainUrl) return

        const controller = new AbortController()

        fetch(evolutionChainUrl, { signal: controller.signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                return response.json()
            })
            .then(data => setEvolutionChain(data.chain))
            .catch(fetchError => {
                if (fetchError.name === "AbortError") return
                setError("Failed to load the evolution chain.")
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [evolutionChainUrl])

    if (loading) return <p className="evolution-panel-status">Loading evolution chain...</p>
    if (error) return <p className="evolution-panel-status" role="alert">{error}</p>
    if (!evolutionChain) return <p className="evolution-panel-status">No evolution chain available.</p>

    const branched = hasBranches(evolutionChain)
    const linearSpecies = branched ? [] : getLinearEvolution(evolutionChain)

    return (
        <section className="pokemon-evolution">
            <div className="pokemon-evolution__heading">
                <GiDna1 aria-hidden="true" />
                <h2>Evolution chain</h2>
            </div>

            {!branched ? (
                <div className="evolution-line">
                    {linearSpecies.map((species, index) => (
                        <div className="evolution-line__item" key={species.name}>
                            {index > 0 && (
                                <span className="evolution-arrow" aria-hidden="true">→</span>
                            )}
                            <EvolutionPokemon species={species} />
                        </div>
                    ))}
                </div>
            ) : (
                <EvolutionTree stage={evolutionChain} />
            )}

            {evolutionChain.evolves_to.length === 0 && (
                <p className="evolution-no-next">{evolutionChain.species.name} does not evolve.</p>
            )}
        </section>
    )
}
