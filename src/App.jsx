import {useEffect, useRef} from "react"
import {useBattle} from "./useBattle"
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const { player, enemy, logs, isProcessing, handleRestart, turnFlow } = useBattle()
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
    
    {player.hp === 0 && (
      <div style={{ textAlign: "center", marginTop: "20px", position: "fixed", top: 0, left: 0, 
      width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5", display: "flex",
      flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 100}}>
        <h2>GAME OVER</h2>
        <button onClick={handleRestart}>やり直す</button>
      </div>
    )}

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
