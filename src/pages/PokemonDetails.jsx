import { useParams } from "react-router";
import usePokemonDetails from "../hooks/usePokemonDetails";
import PokemonDetailsHeader from "../components/PokemonDetailsHeader";
import StatusState from "../components/StatusState";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdOutlineSearch } from "react-icons/md";
import PokemonStats from "../components/PokemonStats";
import usePokemonSpecies from "../hooks/usePokemonSpecies";
import PokemonEvolution from "../components/PokemonEvolution";

export default function PokemonDetails() {
    const { pokemonId } = useParams()
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`

    const { pokemonDetails, loading, error } = usePokemonDetails(url)
    const { description, evolutionChainUrl, loadingSpecies, errorSpecies } = usePokemonSpecies(pokemonDetails.id)

    return (
        <main className="page-container">
            {
                error !== "" ? (
                    <StatusState
                        name={"Unable to load Pokémon"}
                        message={error}
                        icon={<FaCircleExclamation size={40} color="#FF746C" />}
                    />
                ) : Object.keys(pokemonDetails).length === 0 && !loading ? (
                    <StatusState
                        name={"No Pokémon available"}
                        message={"No Pokémon are available to display right now."}
                        icon={<MdOutlineSearch size={40} />}
                    />
                ) : (

                    loading ? (
                        // Skeleton
                        <p>Loading...</p>
                    ) : (
                        <>
                            <section className="pokemon-list">
                                <PokemonDetailsHeader
                                    pokemonDetails={pokemonDetails}
                                    description={description}
                                    descriptionLoading={loadingSpecies}
                                    descriptionError={errorSpecies}
                                />
                            </section>

                            <div className="pokemon-details-panels">
                                <PokemonStats pokemonDetails={pokemonDetails} />

                                {loadingSpecies ? (
                                    <p>Loading evolution info...</p>
                                ) : errorSpecies ? (
                                    <p>Evolution data unavailable.</p>
                                ) : evolutionChainUrl ? (
                                    <PokemonEvolution
                                        key={pokemonDetails.id}
                                        evolutionChainUrl={evolutionChainUrl}
                                    />
                                ) : (
                                    <p>No evolution data available.</p>
                                )}
                            </div>
                        </>
                    )

                )
            }

        </main>
    )
}
