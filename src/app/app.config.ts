import {
  ApplicationConfig,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { EffectsModule, provideEffects } from "@ngrx/effects";
import { editorReducer } from "./state/editor/";
import { EditorEffects } from "./state/editor/";
import { windowReducer } from "./state/window/window.reducer";
import { WindowEffects } from "./state/window/window.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule]),
    provideStore({ window: windowReducer, editor: editorReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([EditorEffects, WindowEffects]),
    // importProvidersFrom(EffectsModule.forRoot([EditorEffects, WindowEffects]))
  ],
};
