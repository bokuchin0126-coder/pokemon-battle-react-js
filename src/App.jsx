import {useBattle} from "./useBattle"
import Enemy from "./Enemy"
import Player from "./Player"
import './App.css'

function App() {
  const { player, enemy, logs, attack } = useBattle()
  
  return (
    <>
    <h1>Battle Game</h1>
    <Player player={player} />
    <button onClick={attack}>Attack</button>
    {enemy && <Enemy enemy={ enemy } />}
    {enemy?.hp === 0 && <h2>YOU WIN</h2>}
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
