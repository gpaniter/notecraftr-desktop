import { Injectable } from "@angular/core";
import { EffectsWrapper } from "../editor/editor.effects";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WindowActions from "./window.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import { tap, withLatestFrom } from "rxjs";
import * as WindowSelectors from "./window.selectors";
import { setToDatabase } from "../../utils/helpers";

@Injectable()
export class WindowEffects extends EffectsWrapper {
  

  saveTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
            WindowActions.updateTheme,
        ),
        withLatestFrom(this.store.select(WindowSelectors.theme)),
        tap(([action, theme]) => {
          setToDatabase("notecraftr-theme", theme);
        })
        
      ),
    {
      dispatch: false,
    }
  );

  constructor(actions$: Actions, store: Store<AppState>) {
    super(actions$, store);
  }
}