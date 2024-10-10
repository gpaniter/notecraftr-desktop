import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { EditorState } from "./editor.reducer";

export const selectEditor = (state: AppState) => {
    return state.editor};

export const selectAllTemplates = createSelector(
  selectEditor,
  (state: EditorState) => state.templates
);

export const selectActiveTemplate = createSelector(
    selectEditor,
    (state: EditorState) => state.templates.find((t) => t.active)
);
