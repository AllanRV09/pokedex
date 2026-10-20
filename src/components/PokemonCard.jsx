import { useEffect, useState } from "react"

export default function PokemonCard(props) {
    const [pokemonDetails, setPokemonDetails] = useState({})

    useEffect(() => {
        fetch(props.pokemon.url)
            .then(res => res.json())
            .then(data => setPokemonDetails(data))
    }, [props.pokemon.url])

    const imgUrl = pokemonDetails.sprites && pokemonDetails.sprites.other["official-artwork"].front_default

    return (
        <article className="pokemon-card">
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

            <img src={imgUrl} alt={`${pokemonDetails.name} card`} />
        </article>
    )
}