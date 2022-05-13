import './FilterList.scss'

export default function FilterList({filters, changeFilter}) {
    const handleClick = (newFilter) => {
        changeFilter(newFilter)
    }

    return (
        <aside className="filter-bar">
            <ul className="list-filters">
                {filters.map((f) => (
                    <li key={f}>
                        <label >
                            <input
                                type="radio"
                                name="filterBy"
                                value={f}
                                onChange={(e) => handleClick(e.target.value)}
                            />
                            {f}
                        </label>
                    </li>
                ))}
            </ul>


        </aside>
    )
}
