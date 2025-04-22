import React, { useEffect, useState } from "react";
import "./Board.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBoardById } from "../../redux/BoardSlice";
import ColumnComponent from "../pages/Column";
import { Card, Status } from "../../types/Card";
import {  moveCardToNewColumn, setCards } from "../../redux/CardSlice";
import { getByBoardId } from "../../services/CardService";


interface BoardProps {
  boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
  const dispatch = useDispatch<AppDispatch>();
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
    }, [dispatch, boardId]);
    
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
          
        })
        .catch((err) => {
          console.error("Greška pri premještanju kartice: ", err);
        });
   
  };
  
  
  return (<div>
    <h1> </h1>
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
</div>
  );
};

export default Board;
