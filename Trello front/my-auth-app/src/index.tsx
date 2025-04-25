import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; 
import { Provider } from "react-redux";
import { store } from "./redux/store";
import './index.css';
import { AuthProvider } from "./utils/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <AuthProvider>
    <Provider store={store}> 
    <BrowserRouter> 
        <App />
    </BrowserRouter>
    </Provider>
    </AuthProvider>
);
