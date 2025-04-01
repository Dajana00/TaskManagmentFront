import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getLoggedIn } from "../services/UserService"; // Tvoja funkcija za dobijanje korisničkih podataka
import { User } from "../redux/User"; // Interfejs korisnika

// Definisanje tipa za AuthContext
interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
}

// Definisanje tipa za AuthProvider, dodajemo 'children' prop tipa ReactNode
interface AuthProviderProps {
    children: ReactNode;
}

// Kreiranje AuthContext-a
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provajder za AuthContext
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("accessToken");
            console.log("Access token: ", token);
            if (token) {
                try {
                    const userData = await getLoggedIn();
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
