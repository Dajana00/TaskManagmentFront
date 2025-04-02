import React, { useEffect, useState } from "react";
import { getLoggedIn } from "../../services/UserService";
import { getUserProjects } from "../../services/UserService"; // Dodaj ovu funkciju
import { createProject } from "../../services/UserService"; // Dodaj ovu funkciju
import { User } from "../../redux/User";
import { Project } from "../../types/Project"; // Kreiraj interfejs za projekat ako ga nemaš
import "./Dashboard.css"; // Dodaj CSS za stilizaciju
import { useAuth } from "../../utils/AuthContext";
import Board from "./Board";

const Dashboard = () => {
    const { user, setUser } = useAuth(); 
    const [projects, setProjects] = useState<Project[]>([]); 
    const [newProjectName, setNewProjectName] = useState("");
    const [creatingProject, setCreatingProject] = useState(false); // Kontroliše prikaz input polja
    const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Pamti ID otvorenog menija
    const [selectedProject, setSelectedProject] = useState<number | null>(null); // Prikaz Boarda


 const toggleDropdown = (projectId: number) => {
        setOpenDropdown(openDropdown === projectId ? null : projectId);
    };

    const openBoard = (projectId: number) => {
        setSelectedProject(projectId);
        console.log("selected project board id: ", projectId);
        localStorage.setItem("selectedProject", projectId.toString()); // Sačuvaj u localStorage
        setOpenDropdown(null); // Zatvaramo meni
    };
    
    useEffect(() => {
        const fetchUserDataAndProjects = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const userData = await getLoggedIn(); // Fetch user details
                    console.log("Fetched user data: ", userData);
                    setUser(userData); // Set user state
                    
                    if (userData.id) {
                        const userProjects = await getUserProjects(userData.id); 
                       console.log("User projects:", userProjects);
                        setProjects(userProjects);
                    }
                    // Postavi selektovani projekt iz localStorage-a
                const savedProject = localStorage.getItem("selectedProject");
                if (savedProject) {
                    setSelectedProject(Number(savedProject)); // Vraća selektovani projekt
                }
                } catch (error) {
                    console.error("Error fetching user or projects:", error);
                }
            }
        };
    
        fetchUserDataAndProjects();
    }, [setUser]); // Runs once when component mounts
    
    
    const handleCreateProject = async () => {
        if (!user?.id || !newProjectName.trim()) return;

        try {
            console.log("Id usera logovanog: ", user.id);
            console.log();
            const newProject = await createProject({id:0, name: newProjectName,ownerId: user.id });
            setProjects((prevProjects) => [...prevProjects, newProject]);
            setNewProjectName(""); // Resetujemo input
            setCreatingProject(false); // Sakrij input posle kreiranja
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar sa projektima */}
            <div className="sidebar">
                <h3>Your Projects</h3>
               {/* Dugme za kreiranje projekta */}
               {!creatingProject ? (
                    <button onClick={() => setCreatingProject(true)} className="create-project-btn">
                        + Create New Project
                    </button>
                ) : (
                    <div className="create-project-container">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Enter project name"
                            className="create-project-input"
                        />
                        <div className="button-group">
                            <button onClick={handleCreateProject} className="confirm-btn">Create</button>
                            <button onClick={() => setCreatingProject(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                )}
                <ul>
    {projects.map((project) => {
        console.log("Project ID:", project.id, "Project Name:", project.name);
        return (
            <li key={project.id} className="project-item">
                <div className="project-header">
                    {project.name}
                    <button onClick={() => toggleDropdown(project.id)} className="dropdown-btn">
                        ▼
                    </button>
                </div>

                {openDropdown === project.id && (
                    <div className="dropdown-menu">
                        <button onClick={() => openBoard(project.boardId)}>Open Board</button>
                    </div>
                )}
            </li>
        );
    })}
</ul>


            </div>

          

          
            <div className="main-content">
                {selectedProject ? (
                    <Board boardId={selectedProject} />
                ) : (
                    <h2>Welcome to Dashboard</h2>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
