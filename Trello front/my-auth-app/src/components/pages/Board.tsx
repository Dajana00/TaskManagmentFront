import React, { useEffect, useState } from "react";
import "./Board.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBoardById } from "../../redux/BoardSlice";
import ColumnComponent from "../pages/Column";
import { Card, Status } from "../../types/Card";
import {  moveCardToNewColumn, resetCards, setCards } from "../../redux/CardSlice";
import { getByBoardId } from "../../services/CardService";
import { completeSprintByBoardId } from "../../redux/SprintSlice";


interface BoardProps {
  boardId: number;
  projectId: number;
}

const Board: React.FC<BoardProps> = ({ boardId , projectId}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cards = useSelector((state: RootState) => state.card.cards); 
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    dispatch(fetchBoardById(boardId));

  }, [dispatch, boardId]);

  
   useEffect(() => {
        const fetchAllCards = async () => {
          dispatch(resetCards(cards));
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
  
  const completeSprintHandler = () => {
    dispatch(completeSprintByBoardId(boardId)) 
      .unwrap()
      .then(() => {
        console.log("Sprint uspešno završen!");
      })
      .catch((err) => {
        let message = "Unexpected error occurred while completing the sprint.";
      
        // Ako err ima .message
        if (typeof err === "object" && err?.message) {
          message = err.message;
        } else if (typeof err === "string") {
          // Pokušaj da izvučeš 'poruku' iz stringa ako je formatovan kao "Exception: Message='Some text'"
          const match = err.match(/Message='([^']+)'/);
          if (match && match[1]) {
            message = match[1];
          } else {
            message = err;
          }
        }
      
        setErrorMessage(message);
      });
      
  };
  
  return (<div>
 <div className="sprint-header">
  <div className="spacer" />
  
  <h2 className="sprint-title">Sprints</h2>
  <button className="complete-sprint-btn">Complete Sprint</button>
</div>


  {errorMessage && <p className="error">{errorMessage}</p>}

    
        <div className="board">

    {statuses.map((status) => (
        <ColumnComponent
        key={status}
        column={{
            id: statuses.indexOf(status),
            name: status,
            cards: getCardsByStatus(status),
        }}
        onCardDrop={handleCardDrop} projectId={projectId}
        />
    ))}
    </div>
</div>
  );
};

export default Board;
