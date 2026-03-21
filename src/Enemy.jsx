function Enemy({ enemy }) {
    return <h3>{enemy.name} HP: {Math.max(0, enemy.hp)}</h3>
}

export default Enemy