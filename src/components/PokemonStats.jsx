import { ImStatsBars2 } from "react-icons/im";

export default function PokemonStats(props) {
    return (
        <section className="pokemon-stats">
            <div>
                <ImStatsBars2 />
                <h2>Base Stats</h2>
            </div>
            <ul className="stats-list">
                {
                    props.pokemonDetails.stats.map(stat => {
                        const progress = stat.base_stat < 50
                            ? "stat-low"
                            : stat.base_stat < 90
                                ? "stat-medium"
                                : "stat-high"

                        return (
                            <li key={stat.stat.name}>
                                <label htmlFor={stat.stat.name} className="stat-name">{stat.stat.name}</label>
                                <progress className={`pokemon-stat-bar ${progress}`} id={stat.stat.name} max={255} value={stat.base_stat}>{stat.base_stat}</progress>
                                <p className="stat-value">{stat.base_stat}</p>
                            </li>)
                    })
                }
            </ul>
        </section>
    )
}