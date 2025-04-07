import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addUserStory, setUserStories } from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
import { useForm } from "../../hooks/useForm";
import InputField from "../common/InputField";
import './Backlog.css';
import { getByBacklogId } from "../../services/UserStoryService";

interface BacklogProps {
    backlogId: number;
}

const Backlog: React.FC<BacklogProps> = ({ backlogId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userStories, loading, error } = useSelector((state: RootState) => state.userStory);

    const initialState = {
        title: "",
        description: "",
    };

    const validate = (values: typeof initialState) => {
        let errors: Partial<typeof initialState> = {};
        if (!values.title.trim()) errors.title = "Title is required";
        if (!values.description.trim()) errors.description = "Description is required";
        return errors;
    };

    const { values, handleChange, handleSubmit, errors, touchedFields } = useForm(initialState, validate);

    const onSubmit = () => {
        const newStory: Omit<UserStory, "id"> = {
            title: values.title,
            description: values.description,
            backlogId,
        };

        dispatch(addUserStory(newStory));
        values.title = "";
        values.description = "";
    };

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const stories = await getByBacklogId(backlogId);
                dispatch(setUserStories(stories)); // <-- postavi ih u Redux
            } catch (err) {
                console.error("Failed to fetch stories", err);
            }
        };
    
        fetchUserStories();
    }, [backlogId, dispatch]);
    
    return (
        <div>
        <div className="wrapper">
            <div className="form-wrapper">
                <h2>Add User Story</h2>
                <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
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
                        <InputField
                            label=""
                            type="text"
                            name="description"
                            value={values.description}
                            placeholder="Description"
                            error={touchedFields.description && errors.description ? errors.description : undefined}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add User Story"}
                    </button>
                    {error && <p className="error-text">{error}</p>}
                </form>
            </div>
        </div>


        <div className="userstory-list">
        <h3>User Stories</h3>
        {Array.isArray(userStories) && userStories.length > 0 ? (
            <ul>
                {userStories.map((story) => (
                    <li key={story.id}>
                        <strong>{story.title}</strong>: {story.description}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No user stories yet.</p>
        )}
</div>
</div>

        
    );
};

export default Backlog;
