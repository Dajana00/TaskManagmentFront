import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addNewSprint, fetchByProjectId, resetSprints, setSprints } from "../../redux/SprintSlice";
import { Sprint, SprintStatus } from "../../types/Sprint";
import { getByProjectId } from "../../services/SprintService";
import { parseJsonText } from "typescript";


interface SprintProps {
    projectId: number;
}
const SprintsPage: React.FC<SprintProps> = ({ projectId }) =>{
    
    const dispatch = useDispatch<AppDispatch>();
    const { sprints, status, error } = useSelector((state: RootState) => state.sprint);

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch sprints on component mount
    useEffect(() => {
        dispatch(resetSprints());
        const fetchSprints = async () => {
            try {
                dispatch(resetSprints());
                console.log("trazi sprintove za id: ", projectId);
                const allSprints = await getByProjectId(projectId);
                dispatch(setSprints(allSprints));
            } catch (err) {
                console.error("Error loading sprints", err);
            }
        };
        fetchSprints();
    }, [dispatch, projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !startDate || !endDate) return;
    
        const newSprint: Omit<Sprint, "id"> = {
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: SprintStatus.Backlog,
            projectId,
        };
    
        await dispatch(addNewSprint(newSprint)).unwrap();
        await dispatch(fetchByProjectId(projectId));
        setName("");
        setStartDate("");
        setEndDate("");
    };
    

    return (
        <div className="sprint-page">
            <h2>Sprints</h2>

            <form onSubmit={handleSubmit} className="sprint-form">
                <input
                    type="text"
                    placeholder="Sprint name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button type="submit">Add Sprint</button>
            </form>

            {status === "loading" && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <ul className="sprint-list">
                {sprints.map((sprint) => (
                    <li key={sprint.id}>
                         <strong>{sprint.name}</strong> (
                    {new Date(sprint.startDate).toLocaleDateString()} - 
                    {new Date(sprint.endDate).toLocaleDateString()}
                          ) - {sprint.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SprintsPage;
