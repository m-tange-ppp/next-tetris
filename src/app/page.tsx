import { NextPage } from "next";
import TetrisGame from "./components/TetrisGame";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className=" text-xl font-bold flex justify-center">Tetris</h1>
      <TetrisGame />
    </div>
  )
}

export default Home;