export default function Pagination(props) {
    const pageItems = (() => {
        if (props.numberPages <= 5) {
            return Array.from({ length: props.numberPages }, (_, index) => index + 1)
        }

        if (props.currentPage <= 3) {
            return [1, 2, 3, "ellipsis-end", props.numberPages]
        }

        if (props.currentPage >= props.numberPages - 2) {
            return [1, "ellipsis-start", props.numberPages - 2, props.numberPages - 1, props.numberPages]
        }

        return [1, "ellipsis-start", props.currentPage - 1, props.currentPage, props.currentPage + 1, "ellipsis-end", props.numberPages]
    })()

    return (
        props.numberPages > 1 && (
            <nav className="pagination" aria-label="Pokemon pagination">
                <button
                    type="button"
                    className="pagination-button"
                    onClick={() => props.setCurrentPage(page => page - 1)}
                    disabled={props.currentPage === 1}
                >
                    Previous
                </button>

                {pageItems.map((item, index) => (
                    typeof item === "number" ? (
                        <button
                            key={item}
                            type="button"
                            className={`pagination-button${props.currentPage === item ? " active" : ""}`}
                            aria-current={props.currentPage === item ? "page" : undefined}
                            onClick={() => props.setCurrentPage(item)}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={`${item}-${index}`} className="pagination-ellipsis" aria-hidden="true">
                            ...
                        </span>
                    )
                ))}

                <button
                    type="button"
                    className="pagination-button"
                    onClick={() => props.setCurrentPage(page => page + 1)}
                    disabled={props.currentPage === props.numberPages}
                >
                    Next
                </button>
            </nav>
        )
    )
}