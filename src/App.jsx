import {useState, useEffect, useRef} from "react"
import {useBattle} from "./useBattle"
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const { player, enemy, logs, isProcessing, handleRestart, turnFlow, portion, powerBeans } = useBattle()
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
          <div className="battleArea">
            <div className="playerscreen">
              <Player player={player} />
              <button disabled={isProcessing } onClick={turnFlow}>{isProcessing ? "攻撃中..." : "Attack"}</button>
              <button onClick={portion}>{`portion × ${player.item.portion}`}</button>
              <button onClick={powerBeans}>{`powerBeans × ${player.item.powerBeans}`}</button>
            </div>

            <div className="vs">VS</div>

            <div className="enemyscreen">{enemy && <Enemy enemy={ enemy } />}</div>
          </div>

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
                <div key={index}>
                  {showHeader && <h3 className="turn">---ターン{currentTurn}---</h3>}
                  <p className={log.type}>{log.text}</p>
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
