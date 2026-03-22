import { useState, useEffect, useRef } from "react"
function Player({ player }) {
    const [displayHp, setDisplayHp] = useState(player.hp)
    const hpPercent = (displayHp / player.maxHp) * 100
    const hpColor = hpPercent <= 20 ? "red" : hpPercent <= 50 ? "orange" : "green"

    const [isHit, setIsHit] = useState(false)
    const [damagePercent, setDamagePercent] = useState(0)

    const prevHpRef = useRef(player.hp)
    
    useEffect(() => {
      const prevHp = prevHpRef.current
    
      if (player.hp < prevHp) {
        const diff = prevHp - player.hp
        const percent = (diff / player.maxHp) * 100
    
        setDamagePercent(percent)
    
        setTimeout(() => {
          setDamagePercent(0)
        }, 300)
      }
    
      prevHpRef.current = player.hp
    }, [player.hp])

    useEffect(() => {
      const prevHp = prevHpRef.current
      if (player.hp < prevHp) {
      setIsHit(true)

      const timer = setTimeout(() => {
        setIsHit(false)
      }, 200)

      return () => clearTimeout(timer)
      }
      return
    }, [player.hp])

    useEffect(() => {
      const timer = setTimeout(() => {
        setDisplayHp(player.hp)
      }, 300)

      return () => clearTimeout(timer)
    }, [player.hp])

    return (
    <>
      <div className={`hp-bar ${isHit ? "hit" : ""}`}>
       <div className="hp-fill" style={{ width: `${hpPercent}%` , backgroundColor: hpColor}} />
       {damagePercent > 0 && (
        <div className="hp-damage" style={{ width: `${damagePercent}%`, left: `${hpPercent}%`}} />
       )}
      </div>
      <h3>Player HP: {player.hp}</h3>
      <h3>撃破数: {player.defeat}</h3>
    </>
    )
}

export default Player