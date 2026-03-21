function Enemy({ enemy }) {
  if (!enemy) return null

  return (
    <>
    <div className="enemy">
    {enemy.image && (
      <img src={enemy.image} alt={enemy.name} />
    )}
    </div>
    <h3>{enemy.name} HP: {Math.max(0, enemy.hp)}</h3>
    </>
  )
}

export default Enemy