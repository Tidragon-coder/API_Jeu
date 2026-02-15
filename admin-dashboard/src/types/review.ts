import type { Game } from "./game";
import type { User } from "./user";

export interface Review {
    _id: string;
    user: User;
    game: Game;
    rating: number;
    comment?: string;
}