function GoalHistoryPreview() {
    const history = [
        { month: "2025.06", goal: 800000, actual: 760000 },
        { month: "2025.05", goal: 800000, actual: 820000 },
        { month: "2025.04", goal: 750000, actual: 700000 },
    ];

    return (
        <section style = {{marginBottom: 24}}>
            <h2>목표 히스토리</h2>

            <ul>
                {history.map((item) => {
                    const success = item.actual < item.goal;

                    return (
                        <li key = {item.month}>
                            {item.month} | 목표 {item.goal.toLocaleString()}원 / 사용 {item.actual.toLocaleString()}원 →{" "}
                            {success ? "달성" : "초과"}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default GoalHistoryPreview;