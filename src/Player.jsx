function Player({ player }) {
    return <h3>Player HP: {Math.max(0, player.hp)}</h3>
}

export default Player