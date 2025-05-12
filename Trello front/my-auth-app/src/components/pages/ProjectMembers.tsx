import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  clearMembers,
  fetchProjectMembers,
  setMembers, addNewMember
} from "../../redux/ProjectMembersSlice";
import { fetchProjectNonMembers, setNonMembers } from "../../redux/ProjectNonMembersSlice";
import { User } from "../../redux/User";
import "./ProjectMembers.css";

interface ProjectMembersProps {
  projectId: number;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { members } = useSelector((state: RootState) => state.projectMembers);
  const { nonMembers } = useSelector((state: RootState) => state.projectNonMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(clearMembers());
    const fetchMembers = async () => {
      try {
        const membersP = await dispatch(fetchProjectMembers(projectId)).unwrap();
        dispatch(setMembers(membersP));
        setLoading(false);
      } catch (err) {
        console.error("Error loading members", err);
        setError("Failed to load project members.");
      }
    };
    fetchMembers();
  }, [dispatch, projectId]);

  const handleOpenModal = async () => {
    try {
      const nonMembers=await dispatch(fetchProjectNonMembers(projectId)).unwrap();
      dispatch(setNonMembers(nonMembers));
      setShowModal(true);
    } catch {
      setError("Failed to load non-members.");
    }
  };

  const handleAddMember = async (userId: number) => {
    try {
      await dispatch(addNewMember({ projectId, userId })).unwrap();
      await dispatch(fetchProjectMembers(projectId)).unwrap(); // refresh members
      await dispatch(fetchProjectNonMembers(projectId)).unwrap(); // refresh non-members
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  return (
    <div className="project-members-container">
      <div className="header">
        <h3 className="project-members-title">Project Members </h3>
        <button onClick={handleOpenModal} className="button-style">ADD</button>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {members.map((user) => (
                <tr key={user.username}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showModal && (
        <div className="modal-overlay-nonMembers">
          <div className="modal-nonMembers">
          <button className="close-icon" onClick={() => setShowModal(false)}>×</button>

            <h4>Select users to add:</h4>
            {nonMembers.length === 0 ? (
              <p>No users available.</p>
            ) : (
              <ul className="user-list">
                {nonMembers.map((user: User) => (
                  <li className="user-list-item" key={user.id}>
                    {user.firstName} {user.lastName} ({user.username})
                    <button onClick={() => handleAddMember(user.id)} className="add-button" >Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembers;
