import Skeleton from "react-loading-skeleton";

export default function PokemonTypesSkeleton() {
    return (
        <span
            className="type-filter-skeleton"
            aria-hidden="true"
        >
            <Skeleton
                height={"100%"}
                width={"100%"}
                borderRadius={30}
            />
        </span>
    )
}