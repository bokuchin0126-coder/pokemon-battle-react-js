import { useState, useEffect, useRef } from "react"

export function useBattle() {
  const [player, setPlayer] = useState(null)

  const [enemy, setEnemy] = useState(null)

  const [logs, setLogs] = useState([])

  const [turn, setTurn] = useState(1)

  const [isProcessing, setIsProcessing] = useState(false)
  const isProcessingRef = useRef(false)

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  async function fetchPokemon(id = null) {
    const pokemonId = id ?? Math.floor(Math.random() * 60) + 1
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    const data = await res.json()

    const hpStat = data.stats.find(s => s.stat.name === "hp")
    const attackStat = data.stats.find(s => s.stat.name === "attack")

    return {
        name: data.name,
        attack: attackStat.base_stat,
        hp: hpStat.base_stat,
        maxHp: hpStat.base_stat,
        image: data.sprites.other["official-artwork"].front_default
    }
  }

  async function playerPokemon() {
    const pokemon = await fetchPokemon(25)
    setPlayer({
      name: pokemon.name,
      attack: Math.floor(pokemon.attack / 2),
      hp: pokemon.hp * 20,
      maxHp: pokemon.maxHp * 20,
      level: 1,
      defeat: 0,
      image: pokemon.image,
      item: {portion: 0, powerBeans: 0}
    })

    setLogs(prev => [
      ...prev,
      {
        text: `[ターン${turn}] Come out my Pokemon ${pokemon.name}!`,
        type: "enemy"
      }
    ])
  }

  useEffect(() => {
    playerPokemon()
  }, [])

  async function spawnEnemy() {
    const pokemon = await fetchPokemon()
    setEnemy({
      name: pokemon.name,
      attack: Math.floor(pokemon.attack / 5),
      hp: pokemon.hp,
      maxHp: pokemon.maxHp,
      level: 1,
      image: pokemon.image
    })

    setLogs(prev => [
      ...prev,
      {
        text: `[ターン${turn}] A wild ${pokemon.name} appeared!`,
        type: "enemy"
      }
    ])
  }

  useEffect(() => {
    spawnEnemy()
  }, [])

  async function bossEnemy(newDefeat) {

    if (newDefeat === 9) {
      const pokemon = await fetchPokemon(146)

      setEnemy({
        name: pokemon.name,
        attack: Math.floor(pokemon.attack / 3),
        hp: pokemon.hp * 1.5,
        maxHp: pokemon.maxHp * 1.5,
        level: 5,
        image: pokemon.image
      })

      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn}] 🔥Boss ${pokemon.name} appears!`,
          type: "enemy"
        }
      ])
    }

    else if (newDefeat === 19) {
      const pokemon = await fetchPokemon(384)

      setEnemy({
        name: pokemon.name,
        attack: Math.floor(pokemon.attack / 2),
        hp: pokemon.hp * 2,
        maxHp: pokemon.maxHp * 2,
        level: 10,
        image: pokemon.image
      })
  
      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn}] 🔥Boss ${pokemon.name} appears!`,
          type: "enemy"
        }
      ])
    }

    else if (newDefeat === 29) {
      const pokemon = await fetchPokemon(150)

      setEnemy({
        name: pokemon.name,
        attack: pokemon.attack,
        hp: pokemon.hp * 3,
        maxHp: pokemon.maxHp * 3,
        level: 20,
        image: pokemon.image
      })

      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn}] 🔥Boss ${pokemon.name} appears!`,
          type: "enemy"
        }
      ])
    }
  }

  function portion() {
    if (player.item.portion > 0) {
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + (300 + (prev.level * 15))),
        item: {
          ...prev.item,
          portion: prev.item.portion - 1
        }
      }))

      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn}] Player used a portion! HP recovered by ${player.hp + (300 + (player.level * 15))}`,
          type: "player"
        }
      ])
    }
  }

  function powerBeans() {
    if (player.item.powerBeans > 0) {
      setPlayer(prev => ({
        ...prev,
        attack: prev.attack + (10 + (prev.level * 3)),
        item: {
          ...prev.item,
          powerBeans: prev.item.powerBeans - 1
        }
      }))

      setLogs(prev => [
        ...prev,
        {
          text: `[ターン${turn}] Player used a powerBeans! Attack power increased by ${10 + (player.level * 3)}`,
          type: "player"
        }
      ])
    }
  }

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

  function calcDefeat(prev) {
    const newDefeat = prev.defeat + 1
    let earnedItem = null

    if (newDefeat % 10 === 0) {
      earnedItem = "portion"
    } else if (newDefeat % 5 === 0) {
      earnedItem = "powerBeans"
    }

    return {newDefeat, earnedItem}
  }

  async function defeatCount(nextEnemyHp) {
    if (nextEnemyHp <= 0) {
      const { newDefeat, earnedItem } = calcDefeat(player)

      setPlayer(prev => ({
          ...prev,
          defeat: newDefeat,
          item: earnedItem
          ? {
            ...prev.item,
            [earnedItem]: prev.item[earnedItem] + 1
          }
          :prev.item
      }))

      let newLogs = [{ text: `[ターン${turn}] Defeat the enemy!`, type: "player"}]

      if (earnedItem) {
        newLogs.push({
            text: `[ターン${turn}] ${earnedItem} を手に入れた！`,
            type: "player"
          })
      }
      setLogs(prev => [...prev, ...newLogs])
      return newDefeat
    }
  }

  async function turnFlow() {
    if (!enemy) return
    if (isProcessingRef.current) return
  
    isProcessingRef.current = true
    setIsProcessing(true)
    
    try {
      const nextEnemyHp = await playerAttack()

      if (nextEnemyHp <= 0 ) {
        const newDefeat = await defeatCount(nextEnemyHp)
        setTurn(prev => prev + 1)

        await wait(500)
        if (newDefeat === 9 || newDefeat === 19 || newDefeat === 29) await bossEnemy(newDefeat)
        else spawnEnemy()
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
      playerPokemon()
      spawnEnemy()
  }

  return {
    player,
    enemy,
    logs,
    isProcessing,
    handleRestart,
    turnFlow,
    portion,
    powerBeans
  }

}