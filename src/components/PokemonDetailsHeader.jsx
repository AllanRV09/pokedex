import { Link } from "react-router";
import { AiOutlineColumnHeight } from "react-icons/ai";
import { RiWeightLine } from "react-icons/ri";
import { CiStar } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";

export default function PokemonDetailsHeader(props) {
    return (
        <section className="pokemon-details-section">
            <Link className="pokemon-details-back" to="/">
                <FaArrowLeft />
                Back to Pokédex
            </Link>

            <div className="pokemon-details">
                <img className="pokemon-details__image" src={props.pokemonDetails.sprites?.other?.["official-artwork"]?.front_default} alt={`Image of ${props.pokemonDetails.name}`} />

                <div className="pokemon-details__content">
                    <span>{props.pokemonDetails.id && "#" + props.pokemonDetails.id.toString().padStart(3, "0")}</span>
                    <h2>{props.pokemonDetails.name}</h2>
                    <ul className="pokemon-details__list pokemon-details__types">
                        {
                            props.pokemonDetails.types &&
                            props.pokemonDetails.types.map(type => (
                                <li
                                    key={type.slot}
                                    className={`type-chip type-${type.type.name}`}
                                >
                                    {type.type.name}
                                </li>
                            ))
                        }
                    </ul>
                    <p>
                        {props.loadingSpecies
                            ? "Loading description..."
                            : props.errorSpecies
                                ? "Description unavailable."
                                : props.description || "No description available."}
                    </p>

                    <div className="pokemon-details__physical-info">
                        <div>
                            <div className="title-info">
                                <AiOutlineColumnHeight size={20} />
                                <span>Height</span>
                            </div>
                            <p>{props.pokemonDetails.height / 10} m</p>
                        </div>
                        <div className="vertical-line"></div>
                        <div>
                            <div className="title-info">
                                <RiWeightLine size={20} />
                                <span>Weight</span>
                            </div>
                            <p>{props.pokemonDetails.weight / 10} kg</p>
                        </div>
                        <div className="vertical-line"></div>
                        <div>
                            <div className="title-info">
                                <CiStar size={20} />
                                <span>Abilities</span>
                            </div>

                            <ul className="abilities">
                                {
                                    props.pokemonDetails.abilities &&
                                    props.pokemonDetails.abilities.map((ability, index) => <li key={index}>{ability.ability.name}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}