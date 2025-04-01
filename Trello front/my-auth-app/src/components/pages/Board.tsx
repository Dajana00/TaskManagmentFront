import React, { useEffect, useState } from "react";
import "./Board.css";
import { Board as BoardType } from "../../types/Board";
import { getBoardById } from "../../services/BoardService";

interface BoardProps {
    boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
    const [board, setBoard] = useState<BoardType | null>(null);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const fetchedBoard = await getBoardById(boardId);
                setBoard(fetchedBoard);
            } catch (error) {
                console.error("Failed to fetch board:", error);
            }
        };

        fetchBoard();
    }, [boardId]);

    return (
        <div className="board-container">
            {board ? (
                <>
                    <h2 className="h2">{board.name} - Board</h2>
                    <div className="board">
                        {board.columns.map((column) => (
                            <div key={column.id} className="board-column">
                                <h3>{column.name}</h3>
                                <div className="task-list">
                                    {/* Ova sekcija će se koristiti za prikaz taskova */}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading board...</p>
            )}
        </div>
    );
};

export default Board;
