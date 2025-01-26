import { AppCatImage } from '../utils/CatModel';

// Extend the action types to include vote actions
export type CatAction =
    | { type: 'SET_CATS'; payload: AppCatImage[] }
    | { type: 'ADD_FAVOURITE'; payload: { imageId: string; favouriteId: string } }
    | { type: 'REMOVE_FAVOURITE'; payload: { favouriteId: string } }
    | { type: 'VOTE_UP'; payload: { imageId: string } }
    | { type: 'VOTE_DOWN'; payload: { imageId: string } };

// Modify the reducer to handle voting actions
export const catReducer = (state: AppCatImage[], action: CatAction): AppCatImage[] => {
    switch (action.type) {
        case 'SET_CATS':
            return action.payload;
        case 'ADD_FAVOURITE':
            return state.map((cat) =>
                cat.imageId === action.payload.imageId
                    ? { ...cat, favouriteId: action.payload.favouriteId }
                    : cat
            );
        case 'REMOVE_FAVOURITE':
            return state.map((cat) =>
                cat.favouriteId === action.payload.favouriteId
                    ? { ...cat, favouriteId: undefined }
                    : cat
            );
        case 'VOTE_UP':
            return state.map((cat) =>
                cat.imageId === action.payload.imageId
                    ? { ...cat, votes: (cat.votes || 0) + 1 } // Increment vote count
                    : cat
            );
        case 'VOTE_DOWN':
            return state.map((cat) =>
                cat.imageId === action.payload.imageId
                    ? { ...cat, votes: (cat.votes || 0) - 1 } // Decrement vote count
                    : cat
            );
        default:
            return state;
    }
};
