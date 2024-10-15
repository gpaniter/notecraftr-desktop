import { createReducer, on } from "@ngrx/store";
import { Note } from "../../types/notecraftr";
import { getFromDatabase, getUniqueId } from "../../utils/helpers";
import * as NotesActions from "./notes.actions";
import { getAllNoteCraftrWindows } from "../../lib/notecraftr-tauri";

export type NotesState = {
  notes: Note[];
};

export const notesInitialState: NotesState = {
  notes: getFromDatabase("notes-notes") || ([] as Note[]),
};

export const notesReducer = createReducer(
  notesInitialState,

  // Update Notes
  on(NotesActions.updateNotes, (state, { notes }) => ({
    ...state,
    notes: notes,
  })),

  // Add note
  on(NotesActions.addNote, (state) => ({
    ...state,
    notes: [...state.notes, newNote(state.notes)],
  })),

  // Update note
  on(NotesActions.updateNote, (state, { note }) => ({
    ...state,
    notes: state.notes.map((n) => (n.id === note.id ? note : n)),
  })),

  // Delete note
  on(NotesActions.deleteNote, (state, { note }) => ({
    ...state,
    notes: state.notes.filter((n) => n.id !== note.id),
  })),

  // Duplicate note
  on(NotesActions.duplicateNote, (state, { note }) => ({
    ...state,
    notes: [
      ...state.notes,
      { ...note, id: getUniqueId(state.notes.map((n) => n.id)) },
    ],
  }))

)


function newNote(notes: Note[]) {
  const newNote = {
    id: getUniqueId(notes.map((n) => n.id)),
    text: "",
    opened: false,
    backgroundClass: `card-bg-${Math.floor(Math.random() * 12) + 1}`, //12 bg in styles.cs
  };
  return newNote;
}
