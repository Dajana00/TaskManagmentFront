import React, { createContext, useContext, useState } from "react";
import { Card } from "../types/Card";
import CardDetails from "../components/pages/CardDetails";

interface CardModalContextType {
  showCard: (card: Card) => void;
  close: () => void;
}

const CardModalContext = createContext<CardModalContextType | undefined>(undefined);

export const useCardModal = () => {
  const context = useContext(CardModalContext);
  if (!context) throw new Error("useCardModal must be used within CardModalProvider");
  return context;
};

export const CardModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const showCard = (card: Card) => setSelectedCard(card);
  const close = () => setSelectedCard(null);

  return (
    <CardModalContext.Provider value={{ showCard, close }}>
      {children}
      {selectedCard && <CardDetails card={selectedCard} onClose={close} />}
    </CardModalContext.Provider>
  );
};
