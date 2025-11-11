import type { Genre } from "./genre";

export interface Game {
    _id: string;
    title: string;
    description?: string;
    release_year?: number;
    genre: Genre| string;
}
