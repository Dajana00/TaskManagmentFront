import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addUserStory } from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
import { useForm } from "../../hooks/useForm"; // Prilagodi putanju ako je potrebno
import InputField from "../common/InputField"; // Prilagodi putanju ako je potrebno
import './Backlog.css'
interface BacklogProps {
    backlogId: number;
}

const Backlog: React.FC<BacklogProps> = ({ backlogId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { userStories, loading, error } = useSelector((state: RootState) => state.userStory);

    // Definiši početno stanje forme
    const initialState = {
        title: "",
        description: "",
    };

    // Definiši validaciju
    const validate = (values: typeof initialState) => {
        let errors: Partial<typeof initialState> = {};
        if (!values.title.trim()) errors.title = "Title is required";
        if (!values.description.trim()) errors.description = "Description is required";
        return errors;
    };

    // Koristi useForm za rukovanje podacima forme
    const { values, handleChange, handleSubmit, errors, touchedFields } = useForm(initialState, validate);

    const onSubmit = () => {
        const newStory: Omit<UserStory, "id"> = {
            title: values.title,
            description: values.description,
            backlogId, // Prosleđujemo backlogId
        };

        dispatch(addUserStory(newStory));

        // Resetuj polja forme nakon uspešnog dodavanja
        values.title = "";
        values.description = "";
    };

    return (
        <div className="wrapper">
            <h2>Backlog for ID: {backlogId}</h2>
            
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
            </form>

            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default Backlog;
