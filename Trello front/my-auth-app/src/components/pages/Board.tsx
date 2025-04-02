import React, { useEffect } from "react";
import "./Board.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchBoardById } from "../../redux/BoardSlice"; // Import Redux thunks
import { moveCard } from "../../redux/CardSlice";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import CardComponent from "../pages/Card";

interface BoardProps {
  boardId: number;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) => state.board.board);
  const status = useSelector((state: RootState) => state.board.status);
  console.log('Board iz Reduxa:', board); 

  useEffect(() => {
    dispatch(fetchBoardById(boardId));
  }, [dispatch, boardId]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || !board) return;
    
  const cardId = Number(result.draggableId);
  const columnId = Number(destination.droppableId);
 // Optimistički update: odmah ažuriraj UI
    dispatch(moveCard({ cardId, columnId }));

 // Zatim pozovi akciju koja ažurira server
    await dispatch(moveCard({ cardId, columnId }));
    //await dispatch(moveCard({ cardId: Number(result.draggableId), columnId: Number(destination.droppableId) }));
  };

  return (
    <div className="board-container">
      {status === "loading" ? (
        <p>Loading board...</p>
      ) : (
        <>
          <h2 className="h2">{board?.name} - Board</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="board">
              {board?.columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id.toString()}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="board-column">
                      <h3>{column.name}</h3>
                      <div className="task-list">
                        {column.cards.map((card, index) => (
                          <CardComponent key={card.id} card={card} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
};

export default Board;
