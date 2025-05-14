import React, { createContext, useContext, useState } from "react";
import { Card } from "../types/Card";
import CardDetails from "../components/pages/CardDetails";

interface CardModalContextType {
  showCard: (card: Card, projectId:number) => void;
  close: () => void;
}

const CardModalContext = createContext<CardModalContextType | undefined>(undefined);

export const useCardModal = () => {
  const context = useContext(CardModalContext);
  if (!context) throw new Error("useCardModal must be used within CardModalProvider");
  return context;
};

export const CardModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [modalData, setModalData] = useState<{ card: Card; projectId: number } | null>(null);

const showCard = (card: Card, projectId: number) => {
  setModalData({ card, projectId });
};
  const close = () => setModalData(null);

  return (
    <CardModalContext.Provider value={{ showCard, close }}>
      {children}
      {modalData && (
      <CardDetails
        card={modalData.card}
        projectId={modalData.projectId}
        onClose={close}
      />
)}

    </CardModalContext.Provider>
  );
};
