import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setUserStories , resetUserStories} from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
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
    const { userStories } = useSelector((state: RootState) => state.userStory);
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

    
        {/* Lista user story-ja */}
        <div className="userstory-section">
            <div className="userstory-list">
                <h1>User stories    

                <button
                    onClick={() => setShowForm((prev) => !prev)}
                   className="show-task-form-btn"
                >
                    {showForm ? "Close Form" : "New"}
                    <FaPlus className="plus-icon"></FaPlus>
                 </button>
                </h1>
               
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
                    

                    <h3>Tasks
                    <button
                    className="show-task-form-btn"
                    onClick={() => setShowTaskForm(true)}
                    >
                    New 
                    <FaPlus className="plus-icon"/>
                    </button>
                    </h3>
                    <TaskList userStoryId={selectedStory.id} />

                    {showTaskForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                        <button className="close-modal" onClick={() => setShowTaskForm(false)}>×</button>
                        <TaskForm userStoryId={selectedStory.id} />
                        </div>
                    </div>
                    )}
            </div>
            )}

        </div>
    </div> 
    );
};

export default Backlog;
