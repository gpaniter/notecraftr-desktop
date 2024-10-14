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
  consoleLogActions$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((action) => {
          if (true) {
            console.log(action);
          }
        })
      ),
    {
      dispatch: false,
    }
  );
  saveTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WindowActions.updateTheme),
        withLatestFrom(this.store.select(WindowSelectors.theme)),
        tap(([action, theme]) => {
          setToDatabase("notecraftr-theme", theme);
        })
      ),
    {
      dispatch: false,
    }
  );

  saveAddonsEnabled$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WindowActions.updateAddonsEnabled),
        withLatestFrom(this.store.select(WindowSelectors.addonsEnabled)),
        tap(([action, addonsEnabled]) => {
          setToDatabase("notecraftr-addons-enabled", addonsEnabled);
        })
      ),
    {
      dispatch: false,
    }
  );

  saveAutoCopyOnTemplateChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WindowActions.updateAutoCopyOnTemplateChange),
        withLatestFrom(
          this.store.select(WindowSelectors.autoCopyOnTemplateChange)
        ),
        tap(([action, autoCopyOnTemplateChange]) => {
          setToDatabase(
            "notecraftr-auto-copy-on-template-change",
            autoCopyOnTemplateChange
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  saveAutoCopyOnOutputChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WindowActions.updateAutoCopyOnOutputChange),
        withLatestFrom(
          this.store.select(WindowSelectors.autoCopyOnOutputChange)
        ),
        tap(([action, autoCopyOnOutputChange]) => {
          setToDatabase(
            "notecraftr-auto-copy-on-output-change",
            autoCopyOnOutputChange
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  saveLinkedSectionsEnabled$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WindowActions.updateLinkedSectionsEnabled),
        withLatestFrom(
          this.store.select(WindowSelectors.linkedSectionsEnabled)
        ),
        tap(([action, linkedSectionsEnabled]) => {
          setToDatabase(
            "notecraftr-linked-sections-enabled",
            linkedSectionsEnabled
          );
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
