import React, { useEffect, useState } from "react";
import { Card as CardType } from "../../types/Card";
import "./Card.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUserStoriesById, resetUserStories, setUserStories } from "../../redux/UserStorySlice";
import CardDetails from "./CardDetails";
import { useCardModal } from "../../hooks/CardModalContext";

interface CardProps {
  card: CardType;
}

function getColorFromId(id: number): string {
  const colors = [
    "#FFD700", // gold
    "#ADFF2F", // green yellow
    "#87CEFA", // light sky blue
    "#FFB6C1", // light pink
    "#DDA0DD", // plum
    "#FFA07A", // light salmon
    "#40E0D0", // turquoise
    "#F08080", // light coral
  ];
  return colors[id % colors.length];
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const userStory = useSelector((state: RootState) =>
    state.userStory.userStories.find(us => us.id === card.userStoryId)
  );

  useEffect(() => {
    if (!userStory && card.userStoryId) {
      dispatch(fetchUserStoriesById(card.userStoryId));
      console.log("Ucitan user story preko id: ")
    }
  }, [card.userStoryId, userStory, dispatch]);


  const borderColor = getColorFromId(card.userStoryId);
 
  const { showCard } = useCardModal();

  
  return (
    <>
    <div className="card"  onClick={() => showCard(card)}
    style={{ borderLeft: `6px solid ${borderColor}` }}
    draggable>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
      <small>Due: {new Date(card.dueDate).toLocaleDateString()}</small>
      <small>User Story: {userStory ? userStory.title : "Unknown"}</small>

    </div>
</>
  );
};

export default CardComponent;
