import {useState, useEffect, useRef} from "react"
import {useBattle} from "./useBattle"
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const { player, enemy, logs, isProcessing, handleRestart, turnFlow } = useBattle()
  const [gameState, setGameState] = useState("start")
  const lastTurnRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    if (!logRef.current) return

    setTimeout(() => {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }, 0)
  }, [logs])
  
  return (
    <>
      {gameState === "start" && (
        <div className="startScreen">
          <h1>Pokemon Battle Game</h1>
          <button onClick={() => setGameState("playing")}>ゲームスタート！</button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <h1>Battle Game</h1>
          <Player player={player} />
          <button disabled={isProcessing } onClick={turnFlow}>{isProcessing ? "攻撃中..." : "Attack"}</button>
          {enemy && <Enemy enemy={ enemy } />}

          {player.defeat === 30 && (
            <div className="gameBreak">
              <h2 className="clear">GAME CLEAR!</h2>
              <button onClick={handleRestart}>もう一度プレイする</button>
            </div>
          )}
    
           {player.hp === 0 && (
            <div className="gameBreak">
              <h2>GAME OVER</h2>
              <button onClick={handleRestart}>やり直す</button>
            </div>
          )}
  
          <div className="log-box" ref={logRef}>
            {logs.map((log, index) => {
              const match = log.text.match(/\[ターン(\d+)\]/)
              const currentTurn = match ? match[1] : null
  
              const showHeader = currentTurn !== lastTurnRef.current
              lastTurnRef.current = currentTurn
  
              return (
                <div key={index} className={log.type}>
                  {showHeader && <h3>---ターン{currentTurn}---</h3>}
                  <p>{log.text}</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

export default App
