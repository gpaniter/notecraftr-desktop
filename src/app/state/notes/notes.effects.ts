import { Injectable } from "@angular/core";
import { EffectsWrapper } from "../editor";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";
import * as NotesActions from "./notes.actions";
import * as NotesSelectors from "./notes.selectors";
import { setToDatabase } from "../../utils/helpers";
import { getAllNoteCraftrWindows } from "../../lib/notecraftr-tauri";

@Injectable()
export class NotesEffects extends EffectsWrapper {
  consoleLogActions$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((action) => {
          if (false) {
            console.log(action);
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  saveNotes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NotesActions.updateNotes,
          NotesActions.addNote,
          NotesActions.updateNote,
          NotesActions.deleteNote,
          NotesActions.duplicateNote
        ),
        withLatestFrom(this.store.select(NotesSelectors.notes)),
        tap(([action, notes]) => {
          setToDatabase("notes-notes", notes);
        })
      ),
    { dispatch: false }
  );



  constructor(actions$: Actions, store: Store<AppState>) {
    super(actions$, store);
  }
}
