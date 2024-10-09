import { NextPage } from "next";
import GameBoard from "./components/GameBoard";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Tetris</h1>
        <GameBoard/>
    </div>
  )
}

export default Home;