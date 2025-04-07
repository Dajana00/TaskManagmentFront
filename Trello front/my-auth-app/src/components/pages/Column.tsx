import React from "react";
import { Card as CardType, Status } from "../../types/Card";
import CardComponent from "./Card";

interface ColumnProps {
  column: { id: number; name: string; cards: CardType[] };
  onCardDrop: (cardId: number, newStatus: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onCardDrop }) => {
  // Funkcija koja se poziva kada kartica počne da se prevlači
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: number) => {
    e.dataTransfer.setData("cardId", cardId.toString());
  };

  // Omogućava drop na koloni
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Funkcija koja se poziva kada kartica padne u novu kolonu
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) return;

    onCardDrop(Number(cardId), column.name); // Ažuriraj kolonu
  };

  return (
    <div
      className="board-column"
      onDragOver={handleDragOver} // Omogućava drag over
      onDrop={handleDrop} // Funkcija za drop
    >
      <h3>{column.name}</h3>
      <div className="task-list">
        {column.cards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)} // Pokreće drag start
          >
            <CardComponent card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
