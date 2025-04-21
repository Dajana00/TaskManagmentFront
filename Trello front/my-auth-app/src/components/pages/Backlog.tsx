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

interface BacklogProps {
    backlogId: number;
}

const Backlog: React.FC<BacklogProps> = ({ backlogId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userStories, loading, error } = useSelector((state: RootState) => state.userStory);
    const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false); 


    const initialState = {
        title: "",
        description: "",
    };
    useEffect(() => {
        setShowTaskForm(false); 
      }, [selectedStory]);
      
    const validate = (values: typeof initialState) => {
        let errors: Partial<typeof initialState> = {};
        if (!values.title.trim()) errors.title = "Title is required";
        if (!values.description.trim()) errors.description = "Description is required";
        return errors;
    };

    const { values, handleChange, handleSubmit, errors, touchedFields } = useForm(initialState, validate);

    const onSubmit = async () => {
        const newStory: Omit<UserStory, "id"> = {
            title: values.title,
            description: values.description,
            backlogId,
        };
    
        try {
            await dispatch(addUserStory(newStory)).unwrap();
            const updatedStories = await getByBacklogId(backlogId);
            dispatch(setUserStories(updatedStories));
    
            values.title = "";
            values.description = "";
        } catch (err) {
            console.error("Greška prilikom dodavanja:", err);
        }
    };
    

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
            <div className="wrapper">
                <h2>Add User Story</h2>
                <form className="form-backlog" onSubmit={(e) => handleSubmit(e, onSubmit)}>
                    <div className="input-box">
                        <InputField
                            label=""
                            type="text"
                            name="title"
                            value={values.title}
                            placeholder="Title"
                            error={touchedFields.title && errors.title ? errors.title : undefined}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-box">
                    <textarea
                        name="description"
                        value={values.description}
                        placeholder="Description"
                        onChange={handleChange}
                        className="textarea-field"
                    />
                    {touchedFields.description && errors.description && (
                        <div className="error-message">{errors.description}</div>
                    )}
                    </div>
                    <div className="form-spacer"></div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add User Story"}
                    </button>
                    {error && <p className="error-text">{error}</p>}
                </form>
            </div>


            <div className="userstory-section">
    <div className="userstory-list">
        <h3>User Stories</h3>
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
