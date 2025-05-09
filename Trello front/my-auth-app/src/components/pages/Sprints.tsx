import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { activateSprintById, addNewSprint, fetchByProjectId, resetSprints, setSprints } from "../../redux/SprintSlice";
import { Sprint, SprintStatus } from "../../types/Sprint";
import { getByProjectId } from "../../services/SprintService";

import "./Sprints.css"
interface SprintProps {
    projectId: number;
}
const SprintsPage: React.FC<SprintProps> = ({ projectId }) =>{
    
    const dispatch = useDispatch<AppDispatch>();
    const { sprints, status } = useSelector((state: RootState) => state.sprint);
    const [errorMessage, setErrorMessage] = useState("");

    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
        setErrorMessage(""); // Resetujemo prethodnu grešku
    
        if(!name){
            setErrorMessage("Name is required");
            return;
        }
        if(!startDate || !endDate){
            setErrorMessage("Dates are required");
            return;
        }
        const newSprint: Omit<Sprint, "id"> = {
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: SprintStatus.Backlog,
            projectId,
        };
    
        try {
            await dispatch(addNewSprint(newSprint)).unwrap();
            await dispatch(fetchByProjectId(projectId));
            setName("");
            setStartDate("");
            setEndDate("");
        } catch (err: any) {
             
            let message = err || "Unexpected error occurred while creating sprint.";
            const match = message.match(/Message='([^']+)'/); // trazim poruku izmedjuu ' '
            if (match && match[1]) {
                message = match[1]; 
            }

            setErrorMessage(message);
        }
    };
    
    
    const handleActivateSprint = async (sprintId: number) => {
        try {
            console.log("Usao u handle: ", sprintId)
            await dispatch(activateSprintById(sprintId)).unwrap();
            dispatch(fetchByProjectId(projectId)); 
        } catch (err: any) {
                let message = err || "Unexpected error occurred while creating sprint.";
                const match = message.match(/Message='([^']+)'/); 
                if (match && match[1]) {
                    message = match[1]; 
                }
                setErrorMessage(message);            
        }
      };
      

    const statusOrder = {
        [SprintStatus.Active]: 0,
        [SprintStatus.Backlog]: 1,
        [SprintStatus.Completed]: 2,
        [SprintStatus.Archived]: 3,
    };
    
    const sortedSprints = [...sprints].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
    
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
                    min={new Date().toISOString().split("T")[0]} 

                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate} 
                    disabled={!startDate} 
                />
                <button type="submit">Add Sprint</button>
            </form>

            {status === "loading" && <p>Loading...</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
            <table className="modern-table">
        <thead>
            <tr>
            <th>Name</th>
            <th>Dates</th>
            <th>Status</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            {sortedSprints.map((sprint) => (
            <tr key={sprint.id}>
                <td><strong>{sprint.name}</strong></td>
                <td>
                {new Date(sprint.startDate).toLocaleDateString("sr-RS")} – {new Date(sprint.endDate).toLocaleDateString("sr-RS")}

                </td>
                <td>{sprint.status}</td>
                <td>
                {sprint.status === SprintStatus.Backlog ? (
                    <button onClick={() => handleActivateSprint(sprint.id)}>Activate</button>
                ) : sprint.status === SprintStatus.Active ? (
                    <span style={{ fontWeight: "bold" }}></span>
                ) : null}

                </td>
            </tr>
            ))}
        </tbody>
        </table>

        </div>
    );
};

export default SprintsPage;
