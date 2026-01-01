import type { Genre } from "./genre";

export interface Game {
    _id: string;
    title: string;
    description?: string;
    release_year?: number;
    editor?: string;
    genre: Genre| null;
    platform?: string;
    slug?: string
    mode?: string
    perspective?: string
}

export type GameID = string; 