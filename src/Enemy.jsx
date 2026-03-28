import { useState, useEffect, useRef } from "react"
function Enemy({ enemy }) {
  if (!enemy) return null
   const [displayHp, setDisplayHp] = useState(enemy.hp)
    const hpPercent = (displayHp / enemy.maxHp) * 100

  const hpColor = hpPercent <= 20 ? "red" : hpPercent <= 50 ? "orange" : "green"
  const [isHit, setIsHit] = useState(false)
  const [damagePercent, setDamagePercent] = useState(0)
  const prevHpRef = useRef(enemy.hp)

  useEffect(() => {
    if (!enemy) return

    const prevHp = prevHpRef.current

    if (enemy.hp < prevHp) {
      const diff = prevHp - enemy.hp
      const percent = (diff / enemy.maxHp) * 100

      setDamagePercent(percent)

      setTimeout(() => {
        setDamagePercent(0)
      }, 300)
    }

    prevHpRef.current = enemy.hp
  }, [enemy.hp])

  useEffect(() => {
    if (!enemy) return
    const prevHp = prevHpRef.current
    
    if (enemy.hp < prevHp) {
    setIsHit(true)

    const timer = setTimeout(() => {
      setIsHit(false)
    }, 400)

    return () => clearTimeout(timer)
    }
    return
  }, [enemy.hp])

  useEffect(() => {
    if (!enemy) return
    const timer = setTimeout(() => {
      setDisplayHp(enemy.hp)
    }, 300)

    return () => clearTimeout(timer)
  }, [enemy.hp])


  return (
    <>
    <div className="enemy">
    {enemy.image && (
      <img src={enemy.image} alt={enemy.name} />
    )}
    </div>
    <div className={`hp-bar ${isHit ? "hit" : ""}`}>
      <div className="hp-fill" style={{ width: `${hpPercent}%` , backgroundColor: hpColor}} />
      {damagePercent > 0 && (
        <div className="hp-damage" style={{ width: `${damagePercent}%`, left: `${hpPercent}%`}} />
      )}
    </div>
    <h3>{enemy.name} HP: {enemy.hp}</h3>
    <h3>attack: {enemy.attack}</h3>
    </>
  )
}

export default Enemy