import type { Game } from "./game";

export interface GameList {
    _id: string;
    user: string;
    game: Game;
    status: string;
}