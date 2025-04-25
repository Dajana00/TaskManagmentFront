import axios from "axios";

export function handleAxiosError(error: unknown, fallbackMessage: string): never {
    if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
            throw new Error(backendMessage);
        }
    }

    throw new Error(fallbackMessage + (error instanceof Error ? ` ${error.message}` : ""));
}
