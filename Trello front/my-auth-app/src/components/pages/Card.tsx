import React from "react";
import { Card as CardType } from "../../types/Card";
import "./Card.css"

interface CardProps {
  card: CardType;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="card" draggable>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
      <small>Due: {new Date(card.dueDate).toLocaleDateString()}</small>
    </div>
  );
};

export default CardComponent;
