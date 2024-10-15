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
import { provideEffects } from "@ngrx/effects";
import { editorReducer, EditorEffects } from "./state/editor/";
import { windowReducer, WindowEffects } from "./state/window/";
import { TextFiltrEffects, textFiltrReducer } from "./state/textfiltr";
import { NotesEffects, notesReducer } from "./state/notes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule]),
    provideStore({
      window: windowReducer,
      editor: editorReducer,
      textFiltr: textFiltrReducer,
      notes: notesReducer
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([EditorEffects, WindowEffects, TextFiltrEffects, NotesEffects]),
    // importProvidersFrom(EffectsModule.forRoot([EditorEffects, WindowEffects]))
  ],
};
