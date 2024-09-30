"use client";

import { useEffect, useRef, useState } from "react";
import { ROWS, COLS, tetrominoes, TYPES } from "../utils/constants";
import { Grid, Position, Shape, Tetromino } from "../utils/types";

const GameBoard = () => {
    const createGrid = (): Grid => {
        return Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }))};



    // テトロミノの配列をランダムに初期化する。
    const initializeTypesArray = () => {
        const newTypes: string[] = [...TYPES];
        for (let i = TYPES.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newTypes[i], newTypes[j]] = [newTypes[j], newTypes[i]]
        }
        typesRef.current = newTypes;
    };



    // テトロミノの種類を初期化する。
    const initializeTetrominoType = () => {
        const types: string[] = typesRef.current;
        if (types.length === 0) {
            initializeTypesArray();
        }

        const randomType: string = typesRef.current.pop() as string;
        const randomTetromino = tetrominoes[randomType];

        // ディープコピーしてrotateを元の配列に影響させないように
        activeTetromino.current = {type: randomTetromino.type, shape: randomTetromino.shape.map(row => [...row])};
    };



    // テトロミノの種類を考慮して真ん中上のpositionを初期化する。
    const initializeFirstPosition = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const center = Math.floor((COLS - width + 1) / 2);

        let top: number = 0;
        if (tetromino.shape[0].every(cell => cell === 0)) {
            top -= 1;
        }
        positionRef.current = {x: center, y: top};
    };



    // ここからuseState, useRefで定義ゾーン。
    // gridを更新して再レンダリングを促す。
    const [grid, setGrid] = useState(() => createGrid());
    
    // nullで初期化するuseRefは初回レンダリング時のみ初期化する。
    // レンダリングのたびに関数を呼ばなくてよいように。
    const typesRef = useRef<string[]>(null!);
    if (typesRef.current === null) {
        initializeTypesArray();
    }
    const activeTetromino = useRef<Tetromino>(null!);
    if (activeTetromino.current === null) {
        initializeTetrominoType();
    }
    const positionRef = useRef<Position>(null!);
    if (positionRef.current === null) {
        initializeFirstPosition();
    }

    // 実際のgridはgridRefに保存する。
    // gridを更新するときに使う。
    const gridRef = useRef(grid);
    const existFullRowsRef = useRef(false);



    const initializeNewTetromino = () => {
        initializeTetrominoType();
        initializeFirstPosition();
    };



    const renderTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        // 現在のgridであるgridRefをディープコピーしていじる。
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        // 直下させる場合のための変数で、プレビューの表示に使う。
        let dropPosition: Position = {...positionRef.current};

        // どこまで落とせるか確認する。
        while (canMove(tetromino, {...dropPosition, y: dropPosition.y + 1})) {
            dropPosition.y++
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    // 直下のテトロミノを設定する。
                    newGrid[dropPosition.y + i][dropPosition.x + j] = {filled: 1, type: "dummy"};
                    // 現在のテトロミノを設定する。
                    // 直下の後に設定して確実に色を反映させる。
                    newGrid[positionRef.current.y + i][positionRef.current.x + j] = {filled: 1, type: tetromino.type};
                }
            }
        }
        // gridを更新して、再レンダリングする。
        setGrid(newGrid);
    };



    const placeTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j] = {filled: 1, type: tetromino.type};
                }
            }
        }
        // gridRefを更新して置いた状態を保存する。
        gridRef.current = newGrid;
        setGrid(newGrid);
    };



    const canMove = (tetromino: Tetromino, newPosition: Position) => {
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        let newY, newX;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    // newPositionを基準にテトロミノの各マスをチェックしていく
                    newY = newPosition.y + i;
                    newX = newPosition.x + j;
                    // newY, newXがgrid内にあり、gridRefで置かれていないかをチェックする。
                    if (newY <= - 1 ||
                        newY >= ROWS || 
                        newX <= -1 ||
                        newX >= COLS ||
                        gridRef.current[newY][newX].filled) {
                        return false;
                    }
                }
            }
        }
        return true;
    };



    const checkFullRows = (): number[] => {
        const fullRows: number[] = [];
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        // 横一列が埋まっている列を探して保存する。
        newGrid.forEach((row, rowIndex) => {
            if (row.every(cell => cell.filled === 1)) {
                fullRows.push(rowIndex);
            }
        });
        return fullRows;
    };



    const clearRows = (rows: number[]) => {
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        // 横一列埋まっている列を消して、上に空白列追加する。
        rows.forEach(y => {
            newGrid.splice(y, 1);
            newGrid.unshift(Array(COLS).fill({ filled: 0 }));
        });
        // gridRefを更新して置いた状態を保存する。
        gridRef.current = newGrid;
        setGrid(newGrid);
    };



    // テトロミノを置いた後のいろいろな処理をする。
    const handleEndOfTurn = () => {
        placeTetromino();
        const fullRows: number[] = checkFullRows();
        if (fullRows.length > 0) {
            clearRows(fullRows);
            // フラグを立てて、setInterval内の挙動を制限する。
            // できればもっとわかりやすくしたい。
            existFullRowsRef.current = true;
        } else {
            initializeNewTetromino();
            if (checkGameOver()) {
                console.log("over");
                resetGameBoard();
            } else {
                renderTetromino();
            }
        }
    };



    const moveTetromino = (direction: string) => {
        // positionRef.currentを変数で置いていないのは、
        // 更新ができないから。
        let nextPosition;
        if (direction === "left") {
            nextPosition = {x: positionRef.current.x - 1, y: positionRef.current.y};
            // 新しいpositionが移動可能であれば、
            // positionRefを更新して、再描画する。
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            }
        } else if (direction === "right") {
            nextPosition = {x: positionRef.current.x + 1, y: positionRef.current.y};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            }
        }else if (direction === "down") {
            nextPosition = {x: positionRef.current.x, y: positionRef.current.y + 1};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            } else {
                // 下に移動できないときは、そのあとの処理をする。
                handleEndOfTurn();
            }
        }
    };



    const rotateTetromino = (direction: string) => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        // rotatedに回転後のテトロミノの形を設定する。
        const rotated: Shape = [];

        if (direction === "left") {
            for (let i = 0; i < width; i++) {
                rotated[i] = [];
                for (let j = 0; j < height; j++) {
                    rotated[i][j] = tetromino.shape[j][width - 1 - i];
                }
            }
        } else {
            for (let i = 0; i < width; i++) {
                rotated[i] = [];
                for (let j = 0; j < height; j++) {
                    rotated[i][j] = tetromino.shape[height - 1 - j][i];
                }
            }
        }
        if (canMove({type: activeTetromino.current.type, shape: rotated}, positionRef.current)) {
            activeTetromino.current.shape = rotated;
            renderTetromino();
        }
    };



    const dropTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        let newPosition: Position = positionRef.current;
        // 一気に下まで落とす。
        while (canMove(tetromino, {...newPosition, y: newPosition.y + 1})) {
            newPosition.y ++;
        }
        renderTetromino();
    };



    const checkGameOver = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                // 新しいテトロミノと既に置かれているものに
                // 重複があればGameOver
                if (tetromino.shape[i][j] && gridRef.current[positionRef.current.y + i][positionRef.current.x + j].filled) {
                    return true
                }
            }
        }
        return false;
    };



    const resetGameBoard = () => {
        gridRef.current = createGrid();
        setGrid(gridRef.current);
        initializeTypesArray();
        initializeNewTetromino();
        renderTetromino();
    };



    // 基本的なゲームの流れ。
    useEffect(() => {
        renderTetromino();
        // setInterval内ではgridは更新されない。
        // gridRefを更新することで盤面を保存する。
        const interval: NodeJS.Timeout = setInterval(() => {
            if (existFullRowsRef.current) {
                // ライン消去をした後の処理。わかりやすくしたい。
                initializeNewTetromino();
                renderTetromino();
                existFullRowsRef.current = false;
            } else {
                moveTetromino("down");
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);



    // キー操作に動きを割り当てる。
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEventInit) => {
            if (!existFullRowsRef.current) {
                if (e.key === "ArrowLeft") {
                    moveTetromino("left");
                } else if (e.key === "ArrowRight") {
                    moveTetromino("right");
                } else if (e.key === "ArrowDown") {
                    moveTetromino("down");
                } else if (e.key === "z") {
                    rotateTetromino("left");
                } else if (e.key === "x") {
                    rotateTetromino("right");
                } else if (e.key === "ArrowUp") {
                    dropTetromino();
                }
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    });



    // 描画部分。テトロミノの種類によって色を変える。
    return (
        <div>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, cellIndex) => (
                        <span
                            key={cellIndex}
                            className={`inline-block w-6 h-6 border border-black -m-px ${cell.filled? cell.type === "I"
                                ? "bg-cyan-500"
                                : cell.type === "O"
                                ? "bg-yellow-500"
                                : cell.type === "T"
                                ? "bg-purple-500"
                                : cell.type === "L"
                                ? "bg-orange-500"
                                : cell.type === "J"
                                ? "bg-blue-500"
                                : cell.type === "S"
                                ? "bg-lime-500"
                                : cell.type === "Z"
                                ? "bg-red-500"
                                : "bg-gray-300"
                                : "bg-white"}`}>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard;