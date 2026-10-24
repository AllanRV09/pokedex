import StatusState from "./StatusState"
import PokemonCard from "./PokemonCard"
import PokemonCardSkeleton from "./skeletons/PokemonCardSkeleton"
import { MdOutlineSearch } from "react-icons/md";
import { FaCircleExclamation } from "react-icons/fa6";

export default function PokemonResults(props) {
    return (
        props.error !== "" ? (
            <StatusState
                    name={"Unable to load Pokémon"}
                    message={props.error}
                    icon={<FaCircleExclamation size={40} color="#FF746C" />}
                />
        ) : props.isPokemonListEmpty ? (
            <StatusState
                    name={"No Pokémon available"}
                    message={"No Pokémon are available to display right now."}
                    icon={<MdOutlineSearch size={40} />}
                />
        ) : (
            <section className="pokemon-list">
                {
                    props.loading ? (
                        Array.from({ length: props.pageSize }).map((_, index) => (
                            <article key={index} className="pokemon-card">
                                <PokemonCardSkeleton />
                            </article>
                        ))
                    ) : props.hasNoResults ? (
                        <StatusState
                                name={"No results"}
                                message={"No Pokémon match your search or selected types. Try adjusting or clearing your filters."}
                                icon={<MdOutlineSearch size={40} />}
                            />
                    ) : (
                        props.visiblePokemon.map(poke =>
                            <PokemonCard key={poke.name} pokemon={poke} />
                        )
                    )
                }
            </section>
        )
    )
}