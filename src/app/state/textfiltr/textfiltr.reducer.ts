import { createReducer, on } from "@ngrx/store";
import { getFromDatabase } from "../../utils/helpers";
import * as TextFiltrActions from "./textfiltr.actions";

export type TextFiltrState = {
    targetText: string;
    filterNumbers: boolean;
    filterLetters: boolean;
    filterSpecialCharacters: boolean;
    filterSpaces: boolean;
    previewVisible: boolean;
};

export const textFiltrInitialState: TextFiltrState = {
    targetText: getFromDatabase<string>("textfiltr-target-text") || "Toggle any filter to change me.. 1, 2, 3, go!",
    filterNumbers: getFromDatabase<boolean>("textfiltr-filter-numbers") || false,
    filterLetters: getFromDatabase<boolean>("textfiltr-filter-letters") || false,
    filterSpecialCharacters: getFromDatabase<boolean>("textfiltr-filter-special-characters") || false,
    filterSpaces: getFromDatabase<boolean>("textfiltr-filter-spaces") || false,
    previewVisible: getFromDatabase<boolean>("textfiltr-preview-visible") || false,
};

export const textFiltrReducer = createReducer(
    textFiltrInitialState,

    // Update Target Text
    on(TextFiltrActions.updateTargetText, (state, { text }) => {
        return {
            ...state,
            targetText: text
        };
    }),

    // Update Filter Numbers
    on(TextFiltrActions.updateFilterNumbers, (state, { enabled }) => {
        return {
            ...state,
            filterNumbers: enabled
        };
    }),

    // Update Filter Letters
    on(TextFiltrActions.updateFilterLetters, (state, { enabled }) => {
        return {
            ...state,
            filterLetters: enabled
        };
    }),

    // Update Filter Special Characters
    on(TextFiltrActions.updateFilterSpecialCharacters, (state, { enabled }) => {
        return {
            ...state,
            filterSpecialCharacters: enabled
        };
    }),

    // Update Filter Spaces
    on(TextFiltrActions.updateFilterSpaces, (state, { enabled }) => {
        return {
            ...state,
            filterSpaces: enabled
        };
    }),

    // Update Preview Visible
    on(TextFiltrActions.updatePreviewVisible, (state, { enabled }) => {
        return {
            ...state,
            previewVisible: enabled
        };
    }),
)