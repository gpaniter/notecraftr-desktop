import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { NotesState } from "./notes.reducer";


export const selectNotes = (state: AppState) => {
    return state.notes;
}

export const notes = createSelector(
    selectNotes,
    (state: NotesState) => state.notes
)