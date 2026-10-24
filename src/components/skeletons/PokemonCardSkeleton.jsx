import Skeleton from 'react-loading-skeleton'

export default function PokemonCardSkeleton() {
    return (
        <>
            <div className="pokemon-card-skeleton-details">
                <Skeleton width="60px" />
                <Skeleton width="50%" height="20px" />
                <div className="pokemon-card-skeleton-types">
                    <Skeleton width="65px" height="20px" />
                    <Skeleton width="65px" height="20px" />
                </div>
            </div>
            <div className="pokemon-card-skeleton-image">
                <Skeleton height="100%" />
            </div>
        </>
    )
}