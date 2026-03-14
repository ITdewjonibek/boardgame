import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
export type PlayerRole = 'host' | 'client' | 'observer';

export interface Player {
    id: string;
    username: string;
    team: 'A' | 'B' | 'None';
    isReady: boolean;
    score: number;
}

export interface RoomState {
    roomId: string | null;
    hostId: string | null;
    players: Record<string, Player>;
    gameStarted: boolean;
    currentStage: number;
}

interface MultiplayerSyncState {
    // Connection
    status: ConnectionStatus;
    socket: WebSocket | null;

    // User
    localPlayerId: string;
    role: PlayerRole;

    // Room Data
    room: RoomState;

    // Actions
    connect: (url: string, username: string) => void;
    disconnect: () => void;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;

    // In-Game Sync
    broadcastAction: (actionType: string, payload: any) => void;
    syncState: (partialState: any) => void;
}

export const useMultiplayerSync = create<MultiplayerSyncState>((set, get) => ({
    status: 'disconnected',
    socket: null,

    localPlayerId: `P_${Math.random().toString(36).substr(2, 9)}`,
    role: 'client',

    room: {
        roomId: null,
        hostId: null,
        players: {},
        gameStarted: false,
        currentStage: 0
    },

    connect: (url, username) => {
        set({ status: 'connecting' });
        // MOCK WEBSOCKET FOR NOW UNTIL BACKEND IS READY
        setTimeout(() => {
            const mockSocket = {
                send: (data: string) => console.log('Mock WS Send:', data),
                close: () => set({ status: 'disconnected', socket: null })
            } as unknown as WebSocket;

            set((state) => ({
                status: 'connected',
                socket: mockSocket,
                room: {
                    ...state.room,
                    players: {
                        [state.localPlayerId]: {
                            id: state.localPlayerId,
                            username,
                            team: 'None',
                            isReady: false,
                            score: 0
                        }
                    }
                }
            }));
        }, 1000);
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) socket.close();
        set({ status: 'disconnected', socket: null, room: { roomId: null, hostId: null, players: {}, gameStarted: false, currentStage: 0 } });
    },

    createRoom: () => {
        const roomId = `RM_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        set((state) => ({
            role: 'host',
            room: {
                ...state.room,
                roomId,
                hostId: state.localPlayerId,
            }
        }));
    },

    joinRoom: (roomId) => {
        set((state) => ({
            role: 'client',
            room: {
                ...state.room,
                roomId,
            }
        }));
    },

    leaveRoom: () => {
        set((state) => ({
            role: 'client',
            room: {
                ...state.room,
                roomId: null,
                hostId: null,
                gameStarted: false
            }
        }));
    },

    broadcastAction: (actionType, payload) => {
        const { socket, room } = get();
        if (socket && room.roomId) {
            socket.send(JSON.stringify({ type: 'ACTION', action: actionType, payload, roomId: room.roomId }));
        }
    },

    syncState: (partialState) => {
        const { socket, room } = get();
        if (socket && room.roomId) {
            socket.send(JSON.stringify({ type: 'SYNC', state: partialState, roomId: room.roomId }));
        }
    }
}));
