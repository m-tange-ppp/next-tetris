"use client";

import { useEffect, useRef, useState } from "react";
import { ROWS, COLS, TETROMINOES, TYPES , WALLKICKDATA} from "../utils/constants";
import { Grid, Position, Shape, Tetromino } from "../utils/types";
import React from "react";


interface GameBoardProps {
    setTypesArray: React.Dispatch<React.SetStateAction<string[]|null>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    resetGame: () => void;
    setHeldTetrominoType: React.Dispatch<React.SetStateAction<string|null>>;
    heldTetrominoType: string|null;
    key: number;
};


const GameBoard: React.FC<GameBoardProps> = React.memo(({ setTypesArray, setScore, resetGame, setHeldTetrominoType, heldTetrominoType }) => {
    const createGrid = (): Grid => {
        return Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }))
    };


    // テトロミノの配列をランダムに初期化して追加する。
    const addTypesArray = (currentTypes: string[]): string[] => {
        const newTypes: string[] = [...TYPES];
        for (let i = TYPES.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newTypes[i], newTypes[j]] = [newTypes[j], newTypes[i]]
        }
        return [...newTypes, ...currentTypes];
    }; 


    // 次のテトロミノを取得する。
    const initializeNextTetromino = (): Tetromino => {
        // typesRefを参照渡ししない。
        if (typesRef.current.length < 3) {
            typesRef.current = addTypesArray(typesRef.current);
        }

        const nextType: string = typesRef.current.pop() as string;
        const nextTetromino: Tetromino = TETROMINOES[nextType];

        // ディープコピーしてrotateを元の配列に影響させないように。
        return {type: nextType, shape: nextTetromino.shape.map(row => [...row])};
    };


    // テトロミノの種類を考慮して真ん中上のpositionを初期化する。
    const initializePosition = (): Position => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const center = Math.floor((COLS - width + 1) / 2);

        let top: number = 0;
        if (tetromino.shape[0].every(cell => cell === 0)) {
            top -= 1;
        }
        return {x: center, y: top};
    };


    // ここからuseState, useRefで定義ゾーン。
    // gridを更新して再レンダリングを促す。
    const [grid, setGrid] = useState<Grid>(() => createGrid());
    
    // nullで初期化するuseRefは初回レンダリング時のみ初期化する。
    // レンダリングのたびに関数を呼ばなくてよいように。
    const typesRef = useRef<string[]>(null!);
    if (typesRef.current === null) {
        typesRef.current = addTypesArray([]);
    }
    const activeTetromino = useRef<Tetromino>(null!);
    if (activeTetromino.current === null) {
        activeTetromino.current = initializeNextTetromino();
    }
    const positionRef = useRef<Position>(null!);
    if (positionRef.current === null) {
        positionRef.current = initializePosition();
    }

    // 実際のgridはgridRefに保存する。
    // gridを更新するときに使う。
    const gridRef = useRef<Grid>(grid);
    const justSettledRef = useRef<boolean>(false);
    const rotationAngleRef = useRef<number>(0);
    const countComboRef = useRef<number>(0);
    const hasHeldRef = useRef<boolean>(false);


    const initializeNewTetromino = (): void => {
        activeTetromino.current = initializeNextTetromino();
        positionRef.current = initializePosition();
        rotationAngleRef.current = 0;
    };


    const renderTetromino = (): void => {
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


    const placeTetromino = (): void => {
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
        justSettledRef.current = true;
        // 再びホールドできるようにする。
        hasHeldRef.current = false;
    };


    const canMove = (tetromino: Tetromino, newPosition: Position): boolean => {
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


    const findFilledRows = (): number[] => {
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


    const clearRows = (rows: number[]): void => {
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


    const calculateScore = (fullrows: number, clearPerfect: boolean): number => {
        let add: number = 0;
        // Tスピンを実装する。
        // 基本の列消し
        switch (fullrows) {
            case 1:
                add += 100;
                break;
            case 2:
                add += 300;
                break;
            case 3:
                add += 500;
                break;
            case 4:
                add += 800;
                break;
        }
        // 各種全消し
        if (clearPerfect) {
            switch (fullrows) {
                case 1:
                    add += 800;
                    break;
                case 2:
                    add += 1000;
                    break;
                case 3:
                    add += 1800;
                    break;
                case 4:
                    add += 2000;
                    break;
            }
        }
        // 連続消し。上限は20コンボ1000点
        const combo: number = countComboRef.current;
        add += Math.min(1000, combo * 50);
        return add;
    };


    const checkPerfect = (): boolean => {
        let countCells: number = 0;
        let clearPerfect: boolean = true;
        gridRef.current.map(rows => rows.map(cell => countCells += cell.filled));
        if (countCells !== 0) {
            clearPerfect = false;
        }
        return clearPerfect;
    };


    const moveTetromino = (direction: string): void => {
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
        } else if (direction === "down") {
            nextPosition = {x: positionRef.current.x, y: positionRef.current.y + 1};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
                setScore(prev => prev + 2);
            } else {
                // 下に移動できないときは、そのあとの処理をする。
                handleEndOfTurn();
            }
        }
    };


    const rotateTetromino = (direction: string): void => {
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

        const newTetromino: Tetromino = {type: activeTetromino.current.type, shape: rotated};
        const newPosition: Position|undefined = calculateSRSPosition(newTetromino, positionRef.current, direction);
        // 回転可能な時の処理
        if (newPosition != null) {
            activeTetromino.current = newTetromino;
            positionRef.current = newPosition;
            if (direction === "left") {
                rotationAngleRef.current = (rotationAngleRef.current + 1) % 4;
            } else {
                // 負にならないように+4している。
                rotationAngleRef.current = (rotationAngleRef.current - 1 + 4) % 4;
            }
            renderTetromino();
            return;
        }
    };


    const calculateSRSPosition = (tetromino: Tetromino, position: Position, direction: string): Position|undefined => {
        let wallKickRule: number[][] = [];
        let initial: string = "L";
        if (direction === "right") {
            initial = "R";
        }
        if (tetromino.type === "I") {
            wallKickRule = WALLKICKDATA[`I${initial}${rotationAngleRef.current}`];
        } else {
            wallKickRule = WALLKICKDATA[`${initial}${rotationAngleRef.current}`];
        }
        // wallKickTypeを先頭から試して、可能であれば回転する。
        for (let i = 0; i < wallKickRule.length; i++) {
            const div = wallKickRule[i];
            const newPosition = {x: position.x + div[0], y: position.y + div[1]};
            if (canMove(tetromino, newPosition)) {
                return newPosition;
            }
        }
        return undefined;
    };


    const dropHardTetromino = (): void => {
        const tetromino: Tetromino = activeTetromino.current;
        let newPosition: Position = positionRef.current;
        // 一気に下まで落とす。
        while (canMove(tetromino, {...newPosition, y: newPosition.y + 1})) {
            newPosition.y ++;
            setScore(prev => prev + 2);
        }
        justSettledRef.current = true;
        renderTetromino();
    };


    const holdTetromino = (): void => {
        // 既にホールドしていたら無視。
        if (hasHeldRef.current) {
            return;
        }
        // ゲーム開始後初回のホールドは次のミノとの交換。
        if (heldTetrominoType === null) {
            setHeldTetrominoType(activeTetromino.current.type);
            initializeNewTetromino();
            return;
        }
        const heldTetromino: Tetromino = TETROMINOES[heldTetrominoType];
        setHeldTetrominoType(activeTetromino.current.type);
        // ここから交換したミノの処理。
        activeTetromino.current =  {type: heldTetromino.type, shape: heldTetromino.shape.map(row => [...row])};
        positionRef.current = initializePosition();
        rotationAngleRef.current = 0;
        hasHeldRef.current = true;
        renderTetromino();
    };


    const checkGameOver = (): boolean => {
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


    // テトロミノを置いた後のいろいろな処理をする。
    const handleEndOfTurn = (): void => {
        placeTetromino();
        const fullRows: number[] = findFilledRows();
        if (fullRows.length > 0) {
            clearRows(fullRows);
            const add = calculateScore(fullRows.length, checkPerfect());
            setScore(prev => prev + add);
            countComboRef.current += 1;
        } else {
            countComboRef.current = 0;
        }
        initializeNewTetromino();
        if (checkGameOver()) {
            console.log("over");
            resetGame();
        }
        justSettledRef.current = false;
    };


    // 基本的なゲームの流れ。
    useEffect(() => {
        renderTetromino();
        // setInterval内ではgridは更新されない。
        // gridRefを更新することで盤面を保存する。
        const interval: NodeJS.Timeout = setInterval(() => {
            if (justSettledRef.current) {
                handleEndOfTurn();
            } else {
                moveTetromino("down");
            }
            renderTetromino();
        }, 500);

        return () => clearInterval(interval);
    }, []);


    // キー操作に動きを割り当てる。
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEventInit) => {
            if (!justSettledRef.current) {
                switch (e.key) {
                    case ("ArrowLeft"):
                        moveTetromino("left");
                        break;
                    case ("ArrowRight"):
                        moveTetromino("right");
                        break;
                    case ("ArrowDown"):
                        moveTetromino("down");
                        break;
                    case ("z"):
                        rotateTetromino("left");
                        break;
                    case ("x"):
                        rotateTetromino("right");
                        break;
                    case ("ArrowUp"):
                        dropHardTetromino();
                        break;
                    case ("c"):
                        holdTetromino();
                        break;
                    default:
                        break;
                }
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    });


    // 次のテトロミノをTetrisGameに通知する。
    useEffect(() => {
        // ShowNextTetromino側でtypesArrayの変更を検知させるためのディープコピー。
        typesRef.current = typesRef.current.map(type => type);
        setTypesArray(typesRef.current);
    }, [activeTetromino.current.type]);


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
    );
});

export default GameBoard;