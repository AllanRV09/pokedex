export default function OrderBy(props) {
    function handleSelect(e) {
        props.setOrderBy(e.target.value)
        props.setCurrentPage(1)
    }

    return (
        <select
            name="orderBy"
            id="orderBy"
            className="order-by"
            aria-label="Order by filter"
            onChange={handleSelect}
            value={props.orderBy}
        >
            <option value="initial-value">Order By</option>
            <option value="id-asc">Pokédex Number (Ascending)</option>
            <option value="id-desc">Pokédex Number (Descending)</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
        </select>
    )
}