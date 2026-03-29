import { useState, useEffect, useRef } from "react"
function Player({ player, turnFlow, portion, powerBeans, isProcessing }) {
    const [displayHp, setDisplayHp] = useState(player.hp)
    const hpPercent = (displayHp / player.maxHp) * 100
    const hpColor = hpPercent <= 20 ? "red" : hpPercent <= 50 ? "orange" : "green"

    const [isHit, setIsHit] = useState(false)
    const [damagePercent, setDamagePercent] = useState(0)

    const prevHpRef = useRef(player.hp)

    const currentHp = player.hp
    const maxHp = player.maxHp
    
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
      }, 400)

      prevHpRef.current = player.hp

      return () => clearTimeout(timer)
      }
      prevHpRef.current = player.hp
    }, [player.hp])

    useEffect(() => {
      const timer = setTimeout(() => {
        setDisplayHp(player.hp)
      }, 300)

      return () => clearTimeout(timer)
    }, [player.hp])

    return (
     <>
    <div className="playerscreen">
      <div className="top">
        <div className="player">
          <h2>Level: {player.level}</h2>
        {player.image && (
          <img src={player.image} alt={player.name} />
        )}
        </div>
      </div>
        <div className="middle">
        <div className={`hp-bar ${isHit ? "hit" : ""}`}>
          <div className="hp-fill" style={{ width: `${hpPercent}%` , backgroundColor: hpColor}} />
          {damagePercent > 0 && (
            <div className="hp-damage" style={{ width: `${damagePercent}%`, left: `${hpPercent}%`}} />
          )}

          <span className="hp-text">
            {currentHp} / {maxHp}
          </span>
        </div>
        <h3>{player.name} HP: {player.hp}</h3>
        <h3>attack: {player.attack}</h3>
        <h3>defeat: {player.defeat}</h3>
      </div>
    
      <div className="bottom">
        <div className="button-group">
          <button disabled={isProcessing } onClick={turnFlow}>{isProcessing ? "攻撃中..." : "Attack"}</button>

          <div className="item-group">
            <button onClick={portion}>{`portion × ${player.item.portion}`}</button>
            <button onClick={powerBeans}>{`powerBeans × ${player.item.powerBeans}`}</button>
          </div>
        </div>
      </div>
    </div>
            
    </>
    )
}

export default Player