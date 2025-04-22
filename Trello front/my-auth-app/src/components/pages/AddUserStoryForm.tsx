import React from "react";
import { useForm } from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addUserStory, setUserStories } from "../../redux/UserStorySlice";
import { UserStory } from "../../types/UserStory";
import { getByBacklogId } from "../../services/UserStoryService";
import InputField from "../common/InputField";
import "./AddUserStoryForm.css";

interface Props {
  backlogId: number;
}

const AddUserStoryForm: React.FC<Props> = ({ backlogId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.userStory);

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

  return (
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
  );
};

export default AddUserStoryForm;
