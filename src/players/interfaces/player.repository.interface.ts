import { Player } from './player.interface'

export interface IPlayerRepository {
    findById(id: string): Promise<Player | null>;
    findByEmail(email: string): Promise<Player | null>;
    findByPhoneNumber(phoneNumber: string): Promise<Player | null>;
    findAll(): Promise<Player[]>;
    create(playerData: Partial<Player>): Promise<Player>;
    update(id: string, playerData: Partial<Player>): Promise<Player | null>;
    delete(id: string): Promise<void>;
}