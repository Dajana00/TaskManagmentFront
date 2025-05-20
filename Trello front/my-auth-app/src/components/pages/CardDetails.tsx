import React, { useEffect, useState } from "react";
import { Card } from "../../types/Card";
import "./CardDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addNewCardMember, fetchCardMembers, fetchCardNonMembers } from "../../redux/UserCardSlice";

interface CardDetailsProps {
  card: Card;
  projectId: number;
  onClose: () => void;
}



const CardDetails: React.FC<CardDetailsProps> = ({ card, onClose, projectId }) => {
    const dispatch = useDispatch<AppDispatch>();
     const members= useSelector((state: RootState) => state.cardMembers.members);
     const nonMembers= useSelector((state: RootState) => state.cardMembers.nonMembers);
    const [showNonMembers, setShowNonMembers] = useState(false);

    
const handleAddMember = (userId: number) => {
  dispatch(addNewCardMember({ cardId: card.id, userId }))
    .unwrap()
    .then(() => {
      dispatch(fetchCardMembers(card.id));
      dispatch(fetchCardNonMembers({ cardId: card.id, projectId }));
    });
};

  useEffect(() => {
    if (card) {
      dispatch(fetchCardMembers(card.id));
      dispatch(fetchCardNonMembers({ cardId: card.id, projectId }));
    }
  }, [dispatch, card.id]);
  
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  return (
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
      <h2>{card.title}</h2>
      <button className="close-button-cardDetails" onClick={onClose}>×</button>
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

    <div className="modal-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>Members</h4>
          <button className="add-member-btn" onClick={() => setShowNonMembers(true)}>Add</button>
        </div>
        <div className="member-bubbles">
          {members.map((member) => (
            <div key={member.id} className="member-bubble"   title={`${member.firstName} ${member.lastName}`}
>
              {getInitials(member.firstName ?? "", member.lastName ?? "")}
            </div>
          ))}
        </div>
      </div>
        {showNonMembers && (
          <div className="modal-section">
            <h4>Available to Add</h4>
            {nonMembers.length === 0 ? (
              <p>No users to add</p>
            ) : (
              <ul className="non-members-list">
                {nonMembers.map((user) => (
                  <li key={user.id} className="non-member-item">
                    {user.firstName} {user.lastName}
                      <button className="add-btn" onClick={() => handleAddMember(user.id)}>Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

    </div>
  </div>
</div>


  );
};

export default CardDetails;
