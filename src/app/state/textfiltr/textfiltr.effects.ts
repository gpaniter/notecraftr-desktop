import { Injectable } from "@angular/core";
import { EffectsWrapper } from "../editor";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";
import * as TextFiltrActions from "./textfiltr.actions";
import * as TextFiltrSelectors from "./textfiltr.selectors";
import { tap, withLatestFrom } from "rxjs";
import { setToDatabase } from "../../utils/helpers";


@Injectable()
export class TextFiltrEffects extends EffectsWrapper {

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

    saveTargetText$ = createEffect(
        () => this.actions$.pipe(
            ofType(TextFiltrActions.updateTargetText),
            withLatestFrom(this.store.select(TextFiltrSelectors.targetText)),
            tap(([action, targetText]) => {
                setToDatabase("textfiltr-target-text", targetText);
            })
        ),
        { dispatch: false }
    )

    saveFilterNumbers$ = createEffect(
        () => this.actions$.pipe(
            ofType(TextFiltrActions.updateFilterNumbers),
            withLatestFrom(this.store.select(TextFiltrSelectors.filterNumbers)),
            tap(([action, filterNumbers]) => {
                setToDatabase("textfiltr-filter-numbers", filterNumbers);
            })
        ),
        { dispatch: false }
    )

    saveFilterLetters$ = createEffect(
        () => this.actions$.pipe(
            ofType(TextFiltrActions.updateFilterLetters),
            withLatestFrom(this.store.select(TextFiltrSelectors.filterLetters)),
            tap(([action, filterLetters]) => {
                setToDatabase("textfiltr-filter-letters", filterLetters);
            })
        ),
        { dispatch: false }
    )

    saveFilterSpecialCharacters$ = createEffect(
        () => this.actions$.pipe(
            ofType(TextFiltrActions.updateFilterSpecialCharacters),
            withLatestFrom(this.store.select(TextFiltrSelectors.filterSpecialCharacters)),
            tap(([action, filterSpecialCharacters]) => {
                setToDatabase("textfiltr-filter-special-characters", filterSpecialCharacters);
            })
        ),
        { dispatch: false }
    )

    saveFilterSpaces$ = createEffect(
        () => this.actions$.pipe(
            ofType(TextFiltrActions.updateFilterSpaces),
            withLatestFrom(this.store.select(TextFiltrSelectors.filterSpaces)),
            tap(([action, filterSpaces]) => {
                setToDatabase("textfiltr-filter-spaces", filterSpaces);
            })
        ),
        { dispatch: false }
    )

    constructor(actions$: Actions, store: Store<AppState>) {
        super(actions$, store);
    }
}