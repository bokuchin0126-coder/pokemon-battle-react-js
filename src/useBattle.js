import { useState, useEffect } from "react"

export function useBattle() {
  const [player, setPlayer] = useState({
    attack: 10,
    hp: 100
  })

  const [enemy, setEnemy] = useState(null)

  const [logs, setLogs] = useState([])

  async function fetchPokemon() {
    const id = Math.floor(Math.random() * 151) + 1
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await res.json()

    const hpStat = data.stats.find(s => s.stat.name === "hp")
    const attackStat = data.stats.find(s => s.stat.name === "attack")
    console.log(data.sprites.front_dafault)

    setEnemy({
        name: data.name,
        attack: Math.floor(attackStat.base_stat / 2),
        hp: hpStat.base_stat,
        image: data.sprites.other["official-artwork"].front_default
    })

    setLogs(prev => [
        `A wild ${data.name} appeared!`,
        ...prev
    ])
  }

  function attack() {
    if (!enemy) return

    const enemyDamage = Math.floor(Math.random() * 10) + enemy.attack
    const nextEnemyHp = enemy.hp - player.attack
    const nextPlayerHp = player.hp - enemyDamage

    setEnemy({
      ...enemy,
      hp: nextEnemyHp
    })
    
    if (nextEnemyHp > 0) { 
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
    fetchPokemon()
  }

  useEffect(() => {
    spawnEnemy()
  }, [])

  useEffect(() => {
    if (!enemy) return

    if (enemy.hp === 0) {
      spawnEnemy()
    }
  }, [enemy])

  return {
    player,
    enemy,
    logs,
    attack
  }

}