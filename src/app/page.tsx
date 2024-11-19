import { NextPage } from "next";
import TetrisGame from "./components/TetrisGame";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className=" text-2xl font-bold flex justify-center my-2">Tetris</h1>
      <TetrisGame />
    </div>
  )
}

export default Home;