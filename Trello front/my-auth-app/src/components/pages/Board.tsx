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
import { getAll } from "../../services/CardService";

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


  const cards = useSelector((state: RootState) => state.card.cards); // Pristupanje karticama iz Redux-a

   useEffect(() => {
        const fetchAllCards = async () => {
            try {
                const stories = await getAll();
                console.log("ucitane kartice ", stories);
                dispatch(setCards(stories)); 
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
    
        fetchAllCards();
    }, [ dispatch]);
    
  const statuses: Status[] = [
    Status.ToDo,
    Status.InProgress,
    Status.QA,
    Status.Done,
  ];
  
  const getCardsByStatus = (status: Status): Card[] => {
    console.log("Usao u metodu filer, ", status);
    console.log("cards: ",cards);
    return cards.filter((card) => card.status === status);
  };
  const handleCardDrop = (cardId: number, newColumnStatus: string) => {
    console.log("Prosledeni new status ", newColumnStatus);
    const statusMap: { [key: string]: Status } = {
      ToDo: Status.ToDo,
      InProgress: Status.InProgress,
      QA: Status.QA,
      Done: Status.Done,
    };
  
    const status = statusMap[newColumnStatus]; // Mapiramo naziv kolone na Status
  console.log()
    if (status) {

      dispatch(moveCardToNewColumn({ cardId, status })) // Poslali smo pravi tip Status umesto stringa
        .unwrap()
        .then(() => {
          console.log("Kartica premestena u novu kolonu!");
        })
        .catch((err) => {
          console.error("Greška pri premještanju kartice: ", err);
        });
    } else {
      console.error("Nevažeći status: ", newColumnStatus);
    }
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
