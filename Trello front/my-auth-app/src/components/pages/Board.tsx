import React, { useEffect, useState } from "react";
import "./Board.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBoardById } from "../../redux/BoardSlice";
//import { moveCard } from "../../redux/CardSlice";
import ColumnComponent from "../pages/Column";
import {Column} from '../../types/Column'
import { Card, Status } from "../../types/Card";
import { fetchAllCards, moveCardToNewColumn, setCards } from "../../redux/CardSlice";
import { getByBoardId } from "../../services/CardService";
import { HubConnectionBuilder } from "@microsoft/signalr";


interface BoardProps {
  boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) => state.board.board);
  const kartice = useSelector((state: RootState) => state.card.cards);
  const cards = useSelector((state: RootState) => state.card.cards); 


  useEffect(() => {
    dispatch(fetchBoardById(boardId));
    console.log("Redux state: ",kartice); 

  }, [dispatch, boardId]);

  
   useEffect(() => {
        const fetchAllCards = async () => {
            try {
                const stories = await getByBoardId(boardId);
                console.log("ucitane kartice ", stories);
                dispatch(setCards(stories)); 
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
    
        fetchAllCards();
    }, [dispatch]);
    
  const statuses: Status[] = [
    Status.ToDo,
    Status.InProgress,
    Status.QA,
    Status.Done,
  ];
  
  const getCardsByStatus = (status: Status): Card[] => {
    console.log("Usao u metodu filer, ", status);
    console.log("cards: ",cards);
    if (!cards || cards.length === 0) {
      return []; 
    }
    return cards.filter((card) => card.status === status);
  };
  const handleCardDrop = (cardId: number, newStatus: string) => {
  
  console.log("Pretvoreni status iz strina u status: ", newStatus);
      dispatch(moveCardToNewColumn({ cardId, newStatus})) 
        .unwrap()
        .then(() => {
          console.log("Kartica premestena u novu kolonu!");
         // dispatch(fetchAllCards()); 
          
        })
        .catch((err) => {
          console.error("Greška pri premještanju kartice: ", err);
        });
   
  };
  
  
  return (
        <div className="board">
    {statuses.map((status) => (
        <ColumnComponent
        key={status}
        column={{
            id: statuses.indexOf(status),
            name: status,
            cards: getCardsByStatus(status),
        }}
        onCardDrop={handleCardDrop}
        />
    ))}
    </div>

  );
};

export default Board;
