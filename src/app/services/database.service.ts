import { effect, Injectable, signal } from '@angular/core';
import { Note, Template } from '../types/notecraftr';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  activeUrl = signal<string>("");

  theme = signal(
    this.getData<{theme: string, color: string}>("notecraftr-theme") || {theme: "light", color: "pink"}
  );

  theme$ = effect(() => {
    const theme = this.theme();
    this.setData("notecraftr-theme", theme);
  });

  addonsEnabled = signal(this.getData<boolean>("notecraftr-addons-enabled") || false);
  addonsEnabled$ = effect(() => {
    const addonsEnabled = this.addonsEnabled();
    this.setData("notecraftr-addons-enabled", addonsEnabled);
  });

  // runAtStartUp = signal(this.getData<boolean>("notecraftr-run-at-startup") || false);
  // runAtStartUp$ = effect(() => {
  //   const runAtStartUp = this.runAtStartUp();
  //   this.setData("notecraftr-run-at-startup", runAtStartUp);
  // });


  // NOTECRAFTR

  templates = signal(
    this.getData<Template[]>("notecraftr-templates") || [
      { title: "Default Template", active: true, sections: [], id: 0 },
    ]
  );

  templates$ = effect(() => {
    const templates = this.templates();
    this.setData("notecraftr-templates", templates);
  });

  linkedSectionsEnabled = signal(this.getData<boolean>("notecraftr-linked-sections-enabled") || false);
  linkedSectionsEnabled$ = effect(() => {
    const linkedSectionsEnabled = this.linkedSectionsEnabled();
    this.setData("notecraftr-linked-sections-enabled", linkedSectionsEnabled);
  });

  autoCopyOnTemplateChange = signal(this.getData<boolean>("notecraftr-auto-copy-on-template-change") || false);

  autoCopyOnTemplateChange$ = effect(() => {
    const autoCopyOnTemplateChange = this.autoCopyOnTemplateChange();
    this.setData("notecraftr-auto-copy-on-template-change", autoCopyOnTemplateChange);
  });

  autoCopyOnOutputChange = signal(this.getData<boolean>("notecraftr-auto-copy-on-output-change") || false);
  autoCopyOnOutputChange$ = effect(() => {
    const autoCopyOnOutputChange = this.autoCopyOnOutputChange();
    this.setData("notecraftr-auto-copy-on-output-change", autoCopyOnOutputChange);
  });


  // NOTES

  notes = signal(
    this.getData<Note[]>("notes-notes") || []
  );

  notes$ = effect(() => {
    const notes = this.notes();
    this.setData("notes-notes", notes);
  });


  // TEXTREPLACR

  filterTexts = signal(this.getData<string[]>("textreplacr-filterTexts") || []);
  filterTexts$ = effect(() => {
    const filterTexts = this.filterTexts();
    this.setData("textreplacr-filterTexts", filterTexts);
  });

  targetText = signal(this.getData<string>("textreplacr-targetText") || "");
  targetText$ = effect(() => {
    const targetText = this.targetText();
    this.setData("textreplacr-targetText", targetText);
  });

  replaceText = signal(this.getData<string>("textreplacr-replaceText") || "");
  replaceText$ = effect(() => {
    const replaceText = this.replaceText();
    this.setData("textreplacr-replaceText", replaceText);
  });

  filterWhiteSpace = signal(this.getData<boolean>("textreplacr-filter-white-space") || false);
  filterWhiteSpace$ = effect(() => {
    const filterWhiteSpace = this.filterWhiteSpace();
    this.setData("textreplacr-filter-white-space", filterWhiteSpace);
  });

  filterSpecialCharacters = signal(this.getData<boolean>("textreplacr-filter-special-characters") || false);
  filterSpecialCharacters$ = effect(() => {
    const filterSpecialCharacters = this.filterSpecialCharacters();
    this.setData("textreplacr-filter-special-characters", filterSpecialCharacters);
  });

  // TEXTFILTR

  textFiltrTargetText = signal(this.getData<string>("textfiltr-target-text") || "Toggle any filter to change me.. 1, 2, 3, go!");
  textFiltrTargetText$ = effect(() => {
    const textFiltrTargetText = this.textFiltrTargetText();
    this.setData("textfiltr-target-text", textFiltrTargetText);
  });
  textFiltrFilterNumbers = signal(this.getData<boolean>("textfiltr-filter-numbers") || false);
  textFiltrFilterNumbers$ = effect(() => {
    const textFiltrFilterNumbers = this.textFiltrFilterNumbers();
    this.setData("textfiltr-filter-numbers", textFiltrFilterNumbers);
  });
  textFiltrFilterLetters = signal(this.getData<boolean>("textfiltr-filter-letters") || false);
  textFiltrFilterLetters$ = effect(() => {
    const textFiltrFilterLetters = this.textFiltrFilterLetters();
    this.setData("textfiltr-filter-letters", textFiltrFilterLetters);
  });
  textFiltrFilterSpecialCharacters = signal(this.getData<boolean>("textfiltr-filter-special-characters") || false);
  textFiltrFilterSpecialCharacters$ = effect(() => {
    const textFiltrFilterSpecialCharacters = this.textFiltrFilterSpecialCharacters();
    this.setData("textfiltr-filter-special-characters", textFiltrFilterSpecialCharacters);
  });
  textFiltrFilterSpaces = signal(this.getData<boolean>("textfiltr-filter-spaces") || false);
  textFiltrFilterSpaces$ = effect(() => {
    const textFiltrFilterSpaces = this.textFiltrFilterSpaces();
    this.setData("textfiltr-filter-spaces", textFiltrFilterSpaces);
  });


  setData<T>(key: string, data: T) {
    const v = JSON.stringify(data);
    localStorage.setItem(key, v);
  }

  getData<T>(key: string): T | undefined {
    const newData = localStorage.getItem(key);
    if (typeof newData === "string") {
      const parsed = JSON.parse(newData, this.sectionDateRevicer);
      return parsed ? (parsed as T) : undefined;
    } else return undefined;
  }

  sectionDateRevicer(key: string, value: any) {
    if (key == "dateValue") {
      try {
        return new Date(value);
      } catch (error) {
        console.log(error, "Created new Date object.");
        return new Date();
      }
    }
    return value;
  }
}
