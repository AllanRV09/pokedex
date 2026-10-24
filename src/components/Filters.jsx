import TypesFilter from "./TypesFilter";
import OrderBy from "./OrderBy"
import { HiXMark } from "react-icons/hi2";
import PokemonTypesSkeleton from "./skeletons/PokemonTypesSkeleton";

export default function Filters(props) {
    return (
        <div className="filters">
            <fieldset className="filter-types">
                <div className="filter-types__options">
                    {
                        props.loadingTypes ?
                            Array.from({ length: 18 }, (_, index) => (
                                <PokemonTypesSkeleton key={index} />
                            ))
                            : props.types.map(type => (
                                <TypesFilter
                                    key={type.name}
                                    types={type}
                                    typeFilter={props.typeFilter}
                                    setTypeFilter={props.setTypeFilter}
                                    setCurrentPage={props.setCurrentPage}
                                    setLoadingByType={props.setLoadingByType}
                                />
                            ))
                    }
                </div>
            </fieldset>

            <div className="filter-actions">
                {(props.search.trim() !== "" || props.typeFilter.length > 0) && <button onClick={props.handleClearFilters}>
                    <HiXMark size={23} />
                    Clear filters
                </button>}

                <OrderBy
                    orderBy={props.orderBy}
                    setOrderBy={props.setOrderBy}
                    setCurrentPage={props.setCurrentPage}
                />
            </div>
        </div>

    )
}