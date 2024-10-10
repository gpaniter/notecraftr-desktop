import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as EditorActions from "./editor.actions";
import { selectActiveTemplate, selectAllTemplates } from "./editor.selectors";
import { from, map, of, withLatestFrom } from "rxjs";
import { AppState } from "../app.state";
import { setToDatabase } from "../../utils/helpers";


/**
 * Work-around for "undefined" actions$
 * https://github.com/ngrx/platform/issues/3278#issuecomment-1575689719
 */
export abstract class EffectsWrapper {
    constructor(protected readonly actions$: Actions, protected readonly store: Store<AppState>) {}
}

@Injectable()
export class EditorEffects extends EffectsWrapper {
  

  saveTemplates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
            EditorActions.loadTemplates,
            EditorActions.addTemplate,
            EditorActions.duplicateTemplate,
            EditorActions.updateTemplate,
            EditorActions.deleteTemplate,
            EditorActions.setActiveTemplate,
            EditorActions.addSection,
            EditorActions.duplicateSection,
            EditorActions.updateSection,
            EditorActions.deleteSection,
        ),
        withLatestFrom(this.store.select(selectAllTemplates)),
        map(([action, templates]) => {
          setToDatabase("notecraftr-templates", templates);
          return of(undefined);
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
