import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { TextFiltrState } from "./textfiltr.reducer";

export const selectTextFiltr = (state: AppState) => {
    return state.textFiltr;
  };

export const targetText = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.targetText
)

export const filterNumbers = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.filterNumbers
)

export const filterLetters = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.filterLetters
)

export const filterSpecialCharacters = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.filterSpecialCharacters
)

export const filterSpaces = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.filterSpaces
)

export const previewVisible = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => state.previewVisible
)

export const output = createSelector(
    selectTextFiltr,
    (state: TextFiltrState) => {
        let output = state.targetText || "";
        if (state.filterNumbers) {
            output = output.replace(/\d/g, "");
        }
        if (state.filterLetters) {
            output = output.replace(/[a-zA-Z]/g, "");
        }
        if (state.filterSpecialCharacters) {
            output = output.replace(/[^\sa-zA-Z\d]/g, "");
        }
        if (state.filterSpaces) {
            output = output.replace(/\s/g, "");
        }
        return output;
    }
)