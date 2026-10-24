import PokemonCard from "./PokemonCard"
import PokemonCardSkeleton from "./skeletons/PokemonCardSkeleton"

export default function PokemonResults(props) {
    return (
        props.error !== "" ? (
            <p>{props.error}</p>
        ) : props.isPokemonListEmpty ? (
            <p>No Pokémon found.</p>
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
                        <p>No Pokémon match your current filters. Try adjusting your search or type selection.</p>
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