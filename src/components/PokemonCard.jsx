import { useEffect, useState } from "react"

export default function PokemonCard(props) {
    const [pokemonDetails, setPokemonDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch(props.pokemon.url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                }

                return res.json()
            })
            .then(data => setPokemonDetails(data))
            .catch((e) => {
                console.error("Error: ", e)
                setError("Failed to load Pokémon details.")
            })
            .finally(() => setLoading(false))
    }, [props.pokemon.url])

    const imgUrl = pokemonDetails.sprites && pokemonDetails.sprites.other["official-artwork"].front_default

    const details =
        loading ? (
            <p>Loading Pokemon details...</p>
        ) : error !== "" ? (
            <p>{error}</p>
        ) : !pokemonDetails.name ? (
            <p>No Pokémon details found.</p>
        ) : (
            <>
                <span>{pokemonDetails.id && "#" + pokemonDetails.id.toString().padStart(3, "0")}</span>

                <h2>{pokemonDetails.name}</h2>
                <ul>
                    {
                        pokemonDetails.types &&
                        pokemonDetails.types.map(type => (
                            <li
                                key={type.slot}
                                className={`type-${type.type.name}`}
                            >
                                {type.type.name}
                            </li>
                        ))
                    }
                </ul>

                <img src={imgUrl} alt={`Image of ${pokemonDetails.name} in its card`} />
            </>
        )

    return (
        <article className="pokemon-card">
            {details}
        </article>
    )
}