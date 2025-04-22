import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addUserStory, setUserStories , resetUserStories} from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
import { useForm } from "../../hooks/useForm";
import InputField from "../common/InputField";
import './Backlog.css';
import { getByBacklogId } from "../../services/UserStoryService";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import AddUserStoryForm from "./AddUserStoryForm";
import { FaPlus } from "react-icons/fa";

interface BacklogProps {
    backlogId: number;
}

const Backlog: React.FC<BacklogProps> = ({ backlogId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userStories, loading, error } = useSelector((state: RootState) => state.userStory);
    const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false); 
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        setShowTaskForm(false); 
      }, [selectedStory]);
      

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                dispatch(resetUserStories());
                const stories = await getByBacklogId(backlogId);
                dispatch(setUserStories(stories));
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
    
        fetchUserStories();
    }, [backlogId, dispatch]);
    
    return (
        <div className="flexbox-container">
       
            
    
        {showForm && (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-modal" onClick={() => setShowForm(false)}>×</button>
            <AddUserStoryForm backlogId={backlogId} />
        </div>
    </div>
)}

    
        {/* Lista user story-ja + task panel */}
        <div className="userstory-section">
            <div className="userstory-list">
                <h1>User stories</h1>
            <button
                onClick={() => setShowForm((prev) => !prev)}
                style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    color: "#333",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                {showForm ? "Close Form" : "New"}
                <FaPlus></FaPlus>
            </button>
                {Array.isArray(userStories) && userStories.length > 0 ? (
                    <ul>
                        {userStories.map((story) => (
                            <li
                                key={story.id}
                                onClick={() => setSelectedStory(story)}
                                className={`userstory-item ${selectedStory?.id === story.id ? "selected" : ""}`}
                            >
                                <strong>{story.title}</strong> {story.description}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No user stories yet.</p>
                )}
            </div>
    
            {selectedStory && (
                <div className="task-panel">
                    {!showTaskForm ? (
                        <button
                            className="show-task-form-btn"
                            onClick={() => setShowTaskForm(true)}
                        >
                            Add New Task
                        </button>
                    ) : (
                        <TaskForm userStoryId={selectedStory.id} />
                    )}
                    <h3>Tasks for: {selectedStory.title}</h3>
                    <TaskList userStoryId={selectedStory.id} />
                </div>
            )}
        </div>
    </div>
    

        
    );
};

export default Backlog;
