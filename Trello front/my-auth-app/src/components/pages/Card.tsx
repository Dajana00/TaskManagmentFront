import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card as CardType } from "../../types/Card";
import "./Card.css";

interface CardProps {
  card: CardType;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            ...provided.draggableProps.style,
            zIndex: snapshot.isDragging ? 9999 : undefined,
            opacity: snapshot.isDragging ? 0.5 : 1, // Možete dodati opacitet dok je u vuči
          }}
        >
          <h4>{card.title}</h4>
          <p>{card.description}</p>
          <small>Due: {new Date(card.dueDate).toLocaleDateString()}</small>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
