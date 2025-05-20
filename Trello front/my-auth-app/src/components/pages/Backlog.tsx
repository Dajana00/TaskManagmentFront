import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setUserStories , resetUserStories, deleteUserStory} from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
import './Backlog.css';
import { getByBacklogId } from "../../services/UserStoryService";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import AddUserStoryForm from "./AddUserStoryForm";
import { FaPlus } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";


interface BacklogProps {
    backlogId: number;
    projectId:number;
}

const Backlog: React.FC<BacklogProps> = ({ backlogId , projectId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userStories } = useSelector((state: RootState) => state.userStory);
    const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false); 
    const [showForm, setShowForm] = useState(false);
    const [storyToEdit, setStoryToEdit] = useState<UserStory | null>(null);


const handleDeleteStory = async (storyId: number) => {
  try {
    await dispatch(deleteUserStory(storyId)).unwrap();
    const updatedStories = await getByBacklogId(backlogId);
    dispatch(setUserStories(updatedStories));
    if (selectedStory?.id === storyId) {
      setSelectedStory(null);
    }
  } catch (error) {
    console.error("Greška pri brisanju:", error);
  }
};
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
            <div className="modal-overlay-backlog ">
                <div className="modal-content-backlog">
                    <AddUserStoryForm
                    backlogId={backlogId}
                    storyToEdit={storyToEdit}
                    onClose={() => {
                        setShowForm(false);
                        setStoryToEdit(null);
                    }}
                    />
                                   </div>
            </div>
            )}

    
        {/* Lista user story-ja */}
        <div className="userstory-section">
            <div className="userstory-list">
            <div className="userstory-header">

                <h1>User stories    

                <button
                    onClick={() => setShowForm((prev) => !prev)}
                   className="show-task-form-btn"
                >
                    {showForm ? "Close Form" : ""}
                    <FaPlus className="plus-icon"></FaPlus>
                 </button>
                </h1>
                </div>
                <div className="userstory-scrollable">
                {Array.isArray(userStories) && userStories.length > 0 ? (
                    <ul>
                        {userStories.map((story) => (
                         <li
                                key={story.id}
                                className={`userstory-item ${selectedStory?.id === story.id ? "selected" : ""}`}
                                >
                                <div onClick={() => setSelectedStory(story)} className="userstory-content">
                                    <strong>{story.title}</strong> {story.description}
                                </div>

                                <div className="userstory-actions">
                                    <Pencil
                                        className="icon edit-icon"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            setStoryToEdit(story);
                                            setShowForm(true);     
                                        }}
                                        />

                                    <Trash2
                                    className="icon delete-icon"
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleDeleteStory(story.id); 
                                    }}
                                    />
                                </div>
                                </li>

                        ))}
                    </ul>
                ) : (
                    <p>No user stories yet.</p>
                )}
                </div>
            </div>
    
            {selectedStory && (
            <div className="task-panel">
                    

                    <h2 className="h2-backlog">Tasks 
                    <button
                    className="show-task-form-btn"
                    onClick={() => setShowTaskForm(true)}
                    >
                     
                    <FaPlus className="plus-icon"/>
                    </button>
                    </h2 >
                        <div className="task-list">
                        <TaskList userStoryId={selectedStory.id} projectId={projectId} />
                        </div>
                    {showTaskForm && (
                    <div className="modal-overlay-backlog">
                        <div className="modal-content-backlog">
                          <TaskForm userStoryId={selectedStory.id} onClose={() => setShowTaskForm(false)} />
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
