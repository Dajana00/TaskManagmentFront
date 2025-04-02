import { Card } from "./Card";

export interface Column {
    id: number;
    name: string;
    boardId: number,
    cards: Card[]
}