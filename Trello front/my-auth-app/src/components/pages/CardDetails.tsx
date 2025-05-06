// components/CardDetails.tsx
import React from "react";
import { Card } from "../../types/Card";
import "./CardDetails.css";

interface CardDetailsProps {
  card: Card;
  onClose: () => void;
}

const CardDetails: React.FC<CardDetailsProps> = ({ card, onClose }) => {
  return (
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
      <h2>{card.title}</h2>
      <button className="close-button" onClick={onClose}>×</button>
    </div>

    <div className="details-grid">
      <div className="modal-section">
        <h4>Description</h4>
        <p>{card.description}</p>
      </div>

      <div className="modal-section">
        <h4>Due Date</h4>
        <p>{new Date(card.dueDate).toLocaleDateString()}</p>
      </div>

      <div className="modal-section">
        <h4>Status</h4>
        <p>{card.status}</p>
      </div>

   
    </div>
  </div>
</div>


  );
};

export default CardDetails;
