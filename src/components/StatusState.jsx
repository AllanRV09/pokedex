export default function StatusState(props) {
    return (
        <div className="empty-state-area">
            <section className="empty-state">
                {props.icon}
                <p>{props.name}</p>
                <span>{props.message}</span>
            </section>
        </div>
    )
}