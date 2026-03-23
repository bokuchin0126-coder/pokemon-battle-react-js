import { useState, useEffect, useRef } from "react"

export function useBattle() {
  const [player, setPlayer] = useState({
    attack: 20,
    hp: 600,
    maxHp: 600,
    defeat: 0
  })

  const [enemy, setEnemy] = useState(null)

  const [logs, setLogs] = useState([])

  const [turn, setTurn] = useState(1)

  const [isProcessing, setIsProcessing] = useState(false)
  const isProcessingRef = useRef(false)

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  async function fetchPokemon(id = null) {
    const pokemonId = id ?? Math.floor(Math.random() * 151) + 1
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    const data = await res.json()

    const hpStat = data.stats.find(s => s.stat.name === "hp")
    const attackStat = data.stats.find(s => s.stat.name === "attack")

    setEnemy({
        name: data.name,
        attack: Math.floor(attackStat.base_stat / 5),
        hp: hpStat.base_stat,
        maxHp: hpStat.base_stat,
        image: data.sprites.other["official-artwork"].front_default
    })

    setLogs(prev => [
      ...prev,
      {
        text: `[ターン${turn}] A wild ${data.name} appeared!`,
        type: "enemy"
      }
    ])
  }

  async function spawnEnemy() {
    fetchPokemon()
  }

  useEffect(() => {
    spawnEnemy()
  }, [])

  async function playerAttack() {
    const nextEnemyHp = Math.max(0, enemy.hp - player.attack)

    setEnemy({
      ...enemy,
      hp: nextEnemyHp
    })
  
    setLogs(prev => [
      ...prev,
      {
        text: `[ターン${turn}] Player attack! ${player.attack}`,
        type: "player"
      }
    ])

    return nextEnemyHp
  }

  async function enemyAttack() {
    const enemyDamage = Math.floor(Math.random() * 10) + enemy.attack
    const nextPlayerHp = Math.max(0, player.hp - enemyDamage)

    if (player.hp > 0) { 
      setPlayer({
        ...player,
        hp: nextPlayerHp
      })
    }

    setLogs(prev => [
      ...prev,
      {
        text: `[ターン${turn}] Enemy attack! ${enemyDamage}`,
        type: "enemy"
      }
    ])
  }

  async function defeatCount(enemyHp) {
    if (enemyHp <= 0) {
      setPlayer(prev => ({
        ...prev,
        defeat: prev.defeat + 1
      }))

      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn} Enemy defeat!]`,
          type: "player"
        }
      ])
    }
  }

  async function turnFlow() {
    if (!enemy) return
    if (isProcessingRef.current) return
    
    isProcessingRef.current = true
    setIsProcessing(true)
    
    try {
      const nextEnemyHp = await playerAttack()
      await defeatCount(nextEnemyHp)
    
      if (nextEnemyHp <= 0) {
        setTurn(prev => prev + 1)

        await wait(500)
        await spawnEnemy()
        isProcessingRef.current = false
        setIsProcessing(false)
        return
      }
  
      await wait(200)
      await enemyAttack()

  } finally {
      isProcessingRef.current = false
      setIsProcessing(false)
    }
  }

  function handleRestart() {
      setPlayer({
        ...player,
        attack: 20,
        hp: 600,
        maxHp: 600,
        defeat: 0
      })

      spawnEnemy()
  }

  return {
    player,
    enemy,
    logs,
    isProcessing,
    handleRestart,
    turnFlow
  }

}