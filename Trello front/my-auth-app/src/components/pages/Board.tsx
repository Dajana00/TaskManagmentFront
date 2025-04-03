import React, { useEffect, useState } from "react";
import "./Board.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBoardById } from "../../redux/BoardSlice";
//import { moveCard } from "../../redux/CardSlice";
import ColumnComponent from "../pages/Column";
import {Column} from '../../types/Column'
import { Card } from "../../types/Card";

interface BoardProps {
  boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) => state.board.board);
  const status = useSelector((state: RootState) => state.board.status);

  const [columns, setColumns] = useState(board?.columns || []);

  useEffect(() => {
    dispatch(fetchBoardById(boardId));
  }, [dispatch, boardId]);

  useEffect(() => {
    if (board) {
      setColumns(board.columns);
    }
  }, [board]);

  const handleCardDrop = (cardId: number, newColumnId: number) => {
    setColumns((prevColumns: Column[]) => {
      let movedCard: Card | undefined;
  
      // Prvo uklanjamo karticu iz njene stare kolone
      const updatedColumns = prevColumns.map((column) => {
        if (column.cards.some((card) => card.id === cardId)) {
          movedCard = column.cards.find((card) => card.id === cardId);
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          };
        }
        return column;
      });
  
      if (!movedCard) return prevColumns; // Ako nije nađena kartica, vraćamo prethodno stanje
  
      // Ažuriramo columnId kartice
      //movedCard = { ...movedCard, columnId: newColumnId };
  
      // Dodajemo karticu u novu kolonu
      return updatedColumns.map((column) =>
        column.id === newColumnId
          ? { ...column, cards: [...column.cards, movedCard!] }
          : column
      );
    });
  
    // Dispatch Redux akcije da osveži stanje u globalnom store-u
    /*dispatch(moveCard({ cardId, columnId: newColumnId }))
      .unwrap()
      .then(() => dispatch(fetchBoardById(boardId))) // Osvežavanje sa servera
      .catch((err) => console.error("Error updating card position:", err)); */
  };
  
  return (
    <div className="board-container">
      {status === "loading" ? (
        <p>Loading board...</p>
      ) : (
        <>
          <h2>{board?.name} - Board</h2>
          <div className="board">
           
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
