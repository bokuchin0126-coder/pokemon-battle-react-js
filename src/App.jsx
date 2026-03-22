import {useEffect, useRef} from "react"
import {useBattle} from "./useBattle"
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const { player, enemy, logs, isProcessing, turnFlow } = useBattle()
  let lastTurn = null
  const logRef = useRef(null)

  useEffect(() => {
    if (!logRef.current) return

    setTimeout(() => {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }, 0)
  }, [logs])
  
  return (
    <>
    <h1>Battle Game</h1>
    <Player player={player} />
    <button disabled={isProcessing } onClick={turnFlow}>{isProcessing ? "攻撃中..." : "Attack"}</button>
    {enemy && <Enemy enemy={ enemy } />}
    {enemy?.hp === 0 && <h2>YOU WIN</h2>}
    {player.hp === 0 && <h2>GAME OVER</h2>}

    <div className="log-box" ref={logRef}>
      {logs.map((log, index) => {
        const match = log.text.match(/\[ターン(\d+)\]/)
        const currentTurn = match ? match[1] : null

        const showHeader = currentTurn !== lastTurn
        lastTurn = currentTurn

        return (
          <div key={index} className={log.type}>
            {showHeader && <h3>---ターン{currentTurn}---</h3>}
            <p>{log.text}</p>
          </div>
        )
      })}
    </div>

    </>
  )
}

export default App
