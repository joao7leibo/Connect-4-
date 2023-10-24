import React, { useEffect, useState } from "react";
import GameCircle from "./GameCircle";
import '../Game.css';
import Header from "./Header";
import Footer from "./Footer";
import { isDraw, isWinner, getComputerMove } from "../Helper";
import { GAME_STATE_PLAYING , NO_PLAYER, PLAYER_1,PLAYER_2, NO_CIRCLES, GAME_STATE_WIN, GAME_STATE_DRAW } from "../Constants";

const GameBoard = () => {
    const [gameBoard, setGameBoard] = useState(Array(NO_CIRCLES).fill(NO_PLAYER));
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    const [gameState, setGameState] = useState(GAME_STATE_PLAYING);
    const [winPlayer, setWinPlayer] = useState(NO_PLAYER);

    console.log(gameBoard);
    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        setCurrentPlayer(PLAYER_1);
        setGameBoard(Array(NO_CIRCLES).fill(NO_PLAYER));
        setGameState(GAME_STATE_PLAYING);
    };

    const initBoard = () => {
        const circles = [];

        for(let i = 0; i < NO_CIRCLES; i++) {
            circles.push(renderCircle(i));
        }
        return circles;
    };

    const suggestMove = () => {
        circleClicked(getComputerMove(gameBoard));
    };

    const circleClicked = (id) => {
        console.log('circle clicked:' + id);

        if(gameBoard[id] !== NO_PLAYER)return;  /*fix for tile used once and cant be used again next turn*/
        if (gameState !== GAME_STATE_PLAYING) return;  /*fix the after winning no more tiles on click */

        if (isWinner(gameBoard,id,currentPlayer)){
             setGameState(GAME_STATE_WIN);
             setWinPlayer(currentPlayer);
        };

        if (isDraw(gameBoard,id,currentPlayer)){
            setGameState(GAME_STATE_DRAW);
            setWinPlayer(currentPlayer);
       };
        
        setGameBoard(prev => {
            return prev.map((circle, pos) => {
                if (pos === id) return currentPlayer;
                return circle;
            })
        });

        const board = [...gameBoard];
        board[id] = currentPlayer;
        setGameBoard(board);

        setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);

        console.log(gameBoard);
        console.log(currentPlayer);
    }

    const renderCircle = (id) => {
        return <GameCircle  key={id} id={id} className={`player_${gameBoard[id]}`} onCircleClicked={circleClicked} />
    }

    return (
        <>
            <Header gameState={gameState} currentPlayer={currentPlayer} winPlayer={winPlayer}/>
            <div className="gameBoard">
                {initBoard()}
            </div>
            <Footer onNewGameClick={initGame} onSuggestClick={suggestMove} gameState={gameState}/>
        </>
    );
};

export default GameBoard;
