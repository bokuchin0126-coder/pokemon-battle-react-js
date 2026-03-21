import { useState, useEffect } from 'react'
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const [player, setPlayer] = useState({
    attack: 10,
    hp: 100
  })

  const [enemy, setEnemy] = useState({
    name: "Slime",
    attack: 2,
    hp: 100
  })

  const [logs, setLogs] = useState([])

  function attack() {
    const enemyDamage = Math.floor(Math.random() * 10) + enemy.attack
    const nextEnemyHp = enemy.hp - player.attack
    const nextPlayerHp = player.hp - enemyDamage

    setEnemy({
      ...enemy,
      hp: nextEnemyHp
    })
    
    if (nextEnemyHp !== 0) { 
      setPlayer({
        ...player,
        hp: nextPlayerHp
      })
    }

    setLogs(prev => [
      `Player attack! ${player.attack}`,
      `Enemy attack! ${enemyDamage}`,
      ...prev
    ])
  }

  function spawnEnemy() {
    setEnemy({
      name: "Goblin",
      attack: 2,
      hp: 100
    })

    setLogs(prev => [
      `Enemy spawn! Goblin appearance`,
      ...prev
    ])
  }

  useEffect(() => {
    if (enemy.hp === 0) {
      spawnEnemy()
    }
  }, [enemy.hp])

  return (
    <>
    <h1>Battle Game</h1>
    <Player player={player} />
    <button onClick={attack}>Attack</button>
    <Enemy enemy={ enemy } />
    {enemy.hp === 0 && <h2>YOU WIN</h2>}
    {player.hp === 0 && <h2>GAME OVER</h2>}
    <div>
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
    </>
  )
}

export default App
