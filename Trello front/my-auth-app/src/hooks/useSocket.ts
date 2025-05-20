import * as signalR from "@microsoft/signalr";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchAllCards } from "../redux/CardSlice";

const API_URL = "http://localhost:5196/cardHub";


const dispatch = useDispatch<AppDispatch>();

const connection = new signalR.HubConnectionBuilder()
    .withUrl(API_URL) // backend URL
    .withAutomaticReconnect()
    .build();

connection.start()
    .then(() => console.log("Connected to SignalR"))
    .catch((err) => console.error("SignalR connection error:", err));

connection.on("CardMoved", (cardId: number, newStatus: string) => {
    console.log("******************USAOOOOO********************8")
    console.log(`Card ${cardId} moved to ${newStatus}`);
   
});
