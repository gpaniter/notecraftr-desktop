import { createReducer, on } from "@ngrx/store";
import { maximize, unmaximize } from "./window.actions";


export type WindowState = {
    maximized: boolean;
    minimized: boolean;
    position: { x: number; y: number; };
    size: { width: number; height: number; };
};

export const windowInitialState: WindowState = {
    maximized: false,
    minimized: false,
    position: { x: 0, y: 0 },
    size: { width: 800, height: 600 }
};

export const windowReducer = createReducer(
    windowInitialState,

    // Maximize
    on(maximize, (state) => {
        return {
            ...state,
            maximized: true
        };
    }),

    // Unmaximize
    on(unmaximize, (state) => {
        return {
            ...state,
            maximized: false
        };
    }),
)