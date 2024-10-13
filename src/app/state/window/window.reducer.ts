import { createReducer, on } from "@ngrx/store";
import * as WindowActions from "./window.actions";
import { getFromDatabase } from "../../utils/helpers";
import { Message } from "primeng/api";


export type WindowState = {
    maximized: boolean;
    minimized: boolean;
    activeUrl: string;
    position: { x: number; y: number; };
    size: { width: number; height: number; };
    theme: {theme: string, color: string};
    addonsEnabled: boolean;
    autoCopyOnTemplateChange: boolean;
    autoCopyOnOutputChange: boolean;
    linkedSectionsEnabled: boolean;
    message: Message | undefined;
    

};

export const windowInitialState: WindowState = {
    maximized: false,
    minimized: false,
    activeUrl: "",
    message: undefined,
    position: { x: 0, y: 0 },
    size: { width: 800, height: 600 },
    theme: getFromDatabase("notecraftr-theme") || {theme: "light", color: "pink"},
    addonsEnabled: getFromDatabase<boolean>("notecraftr-addons-enabled") || false,
    autoCopyOnTemplateChange: getFromDatabase<boolean>("notecraftr-auto-copy-on-template-change") || false,
    autoCopyOnOutputChange: getFromDatabase<boolean>("notecraftr-auto-copy-on-output-change") || false,
    linkedSectionsEnabled: getFromDatabase<boolean>("notecraftr-linked-sections-enabled") || false,
};

export const windowReducer = createReducer(
    windowInitialState,

    // Maximize
    on(WindowActions.maximize, (state) => {
        return {
            ...state,
            maximized: true
        };
    }),

    // Unmaximize
    on(WindowActions.unmaximize, (state) => {
        return {
            ...state,
            maximized: false
        };
    }),

    // Update Theme
    on(WindowActions.updateTheme, (state, { theme }) => {
        return {
            ...state,
            theme: theme
        };
    }),

    // Update Active Url
    on(WindowActions.updateActiveUrl, (state, { url }) => {
        return {
            ...state,
            activeUrl: url
        };
    }),

    // Update autocopy on template change
    on(WindowActions.updateAutoCopyOnTemplateChange, (state, { enabled }) => {
        return {
            ...state,
            autoCopyOnTemplateChange: enabled
        };
    }),

    // Update autocopy on output change
    on(WindowActions.updateAutoCopyOnOutputChange, (state, { enabled }) => {
        return {
            ...state,
            autoCopyOnOutputChange: enabled
        };
    }),

    // Update linked sections enabled
    on(WindowActions.updateLinkedSectionsEnabled, (state, { enabled }) => {
        return {
            ...state,
            linkedSectionsEnabled: enabled
        };
    }),

    // Update Addons Enabled
    on(WindowActions.updateAddonsEnabled, (state, { enabled }) => {
        return {
            ...state,
            addonsEnabled: enabled
        };
    }),

    // Show message
    on(WindowActions.showMessage, (state, { message }) => {
        return {
            ...state,
            message: message
        };
    }),
)