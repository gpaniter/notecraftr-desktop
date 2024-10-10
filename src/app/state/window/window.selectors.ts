import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { WindowState } from "./window.reducer";

export const selectWindow = (state: AppState) => {
    return state.window;
}

export const selectMaximized = createSelector(
    selectWindow,
    (state: WindowState) => state.maximized
  );