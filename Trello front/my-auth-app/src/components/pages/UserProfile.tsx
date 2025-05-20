import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { useAuth } from "../../utils/AuthContext";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import InputField from "../common/InputField";
import axiosInstance from "../../utils/AxiosIntance";
import { logout } from "../../redux/AuthSlice";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
    const { user, setUser } = useAuth();
    const [editingField, setEditingField] = useState<string | null>(null);
    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
    const [originalValues, setOriginalValues] = useState<{ [key: string]: string }>({});
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | null }>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFieldValues({
                username: user.username,
                email: user.email,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
            });

            setOriginalValues({
                username: user.username,
                email: user.email,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
            });
        }
    }, [user]);

    const handleEditClick = (field: string, currentValue: string) => {
        setEditingField(field);
        setFieldValues((prev) => ({ ...prev, [field]: currentValue }));
    };

    const handleCancel = () => {
        if (editingField) {
            setFieldValues((prev) => ({ ...prev, [editingField]: originalValues[editingField] }));
        }
        setEditingField(null);
    };

  const handleConfirm = async () => {
    if (!editingField) return;

    const value = fieldValues[editingField];
    const error = validateProfileField(editingField, value);

    if (error) {
        setFieldErrors({ [editingField]: error });
        return;
    }

    try {
        const response = await axiosInstance.patch(`/user/${user?.id}`, {
            [editingField]: value,
        });

        setUser(response.data);
        setEditingField(null);
        setFieldErrors({});
    } catch (error) {
        console.error("Error updating user:", error);
    }



};
const validateProfileField = (field: string, value: string): string | null => {
    if (!value.trim()) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (field === "email" && !value.includes("@")) {
        return "Invalid email address";
    }

    if (field === "phoneNumber" && !/^\+?\d{7,15}$/.test(value)) {
        return "Invalid phone number";
    }

    return null;
};
const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); 
};
const renderField = (label: string, field: string, value: string) => {
    const isEditing = editingField === field;

    return (
        <div className="profile-item" key={field}>
            <div className="profile-label">{label}</div>
            {isEditing ? (
                <div className="edit-container">
                    <InputField 
                        type="text"
                        name={field}
                        value={fieldValues[field] || ""}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        onChange={(e) => setFieldValues({ ...fieldValues, [field]: e.target.value })} label={""}                    />
                    <button className="cancel-btn-icon" onClick={handleCancel}>
                        <FiX />
                    </button>
                    <button className="confirm-btn-icon" onClick={handleConfirm}>
                        <FiCheck />
                    </button>
                    {fieldErrors[field] && <div className="error-message">{fieldErrors[field]}</div>}

                </div>
            ) : (
                <div className="profile-value">
                    {value}
                    <button
                        className="edit-btn"
                        onClick={() => handleEditClick(field, value)}
                    >
                        <FiEdit2 />
                    </button>
                </div>
            )}
        </div>
    );
};

    if (!user) {
        return <div className="user-profile"><p>Loading...</p></div>;
    }

    return (
        <div>
         <button className="logout-btn" onClick={() => handleLogout()}>
            <FiLogOut style={{verticalAlign: "middle", marginRight: "6px" ,marginTop:"-2px"}} />
            Log Out
        </button>

  
        <div className="user-profile">
            
            <h2>My Profile</h2>
            <div className="profile-info">
                {renderField("Username", "username", user.username)}
                {renderField("Email", "email", user.email)}
                {renderField("First Name", "firstName", user.firstName || "")}
                {renderField("Last Name", "lastName", user.lastName || "")}
                {renderField("Phone Number", "phoneNumber", user.phoneNumber || "")}
            </div>
        </div>
          </div>
    );
};

export default UserProfile;
