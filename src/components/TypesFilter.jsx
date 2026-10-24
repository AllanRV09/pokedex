export default function TypesFilter(props) {
    const isChecked = props.typeFilter.includes(props.types.name)
    const disabledType = props.typeFilter.length > 1 && !isChecked

    function handleCheckbox(e) {
        const isChecked = e.target.checked
        const nextTypeFilter = isChecked
            ? [...props.typeFilter, props.types.name]
            : props.typeFilter.filter(type => type !== e.target.name)

        props.setCurrentPage(1)
        props.setTypeFilter(nextTypeFilter)
        props.setLoadingByType(nextTypeFilter.length > 0)
    }

    return (
        <label className={`type-chip filter-types__option type-${props.types.name}`}>
            <input
                type="checkbox"
                name={props.types.name}
                id={props.types.name}
                onChange={handleCheckbox}
                checked={isChecked}
                disabled={disabledType}
            />
            {props.types.name}
        </label>
    )
}