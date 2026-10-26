import PokemonCardSkeleton from "./skeletons/PokemonCardSkeleton"
import usePokemonDetails from "../hooks/usePokemonDetails"
import { Link } from "react-router"

export default function PokemonCard(props) {
    const { pokemonDetails, loading, error } = usePokemonDetails(props.pokemon.url)

    const imgUrl = pokemonDetails.sprites?.other?.["official-artwork"]?.front_default

    const details =
        loading ? (
            <PokemonCardSkeleton />
        ) : error !== "" ? (
            <p>{error}</p>
        ) : !pokemonDetails.name ? (
            <p>No Pokémon details found.</p>
        ) : (
            <Link className="pokemon-card__link" to={`/pokemon/${pokemonDetails.id}`}>
                <span>{pokemonDetails.id && "#" + pokemonDetails.id.toString().padStart(3, "0")}</span>

                <h2>{pokemonDetails.name}</h2>
                <ul>
                    {
                        pokemonDetails.types &&
                        pokemonDetails.types.map(type => (
                            <li
                                key={type.slot}
                                className={`type-chip type-${type.type.name}`}
                            >
                                {type.type.name}
                            </li>
                        ))
                    }
                </ul>

                <img src={imgUrl} alt={`Image of ${pokemonDetails.name} in its card`} />
            </Link>
        )

    return (
        <article className="pokemon-card">
            {details}
        </article>
    )
}
