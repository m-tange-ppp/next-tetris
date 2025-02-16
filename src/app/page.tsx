import { NextPage } from "next";
import TetrisGame from "../components/TetrisGame";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-900">
      <h1 className="text-4xl font-extrabold text-center py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
        Next Tetris
      </h1>
      <TetrisGame />
    </div>
  );
};

export default Home;
