export default function TypesFilter(props) {
    const isChecked = props.typeFilter.includes(props.types.name)
    const disabledType = props.typeFilter.length > 1 && !isChecked

    function handleCheckbox(e) {
        const isChecked = e.target.checked

        props.setCurrentPage(1)

        if (isChecked) {
            return props.setTypeFilter([...props.typeFilter, props.types.name])
        }

        return props.setTypeFilter(props.typeFilter.filter(type => props.types.name !== type))
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