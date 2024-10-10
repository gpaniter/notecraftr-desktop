import { createReducer, on } from "@ngrx/store";
import { Template } from "../../types/notecraftr";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setActiveTemplate,
  duplicateTemplate,
  loadTemplates,
} from "./editor.actions";
import { getFromDatabase, getUniqueId } from "../../utils/helpers";

export type EditorState = {
  templates: Template[];
};

export const editorInitialState: EditorState = {
  templates: getFromDatabase("notecraftr-templates") || [],
};

export const editorReducer = createReducer(
  editorInitialState,

  // Load Templates
  on(loadTemplates, (state, {templates}) => {
    return {...state, templates}
  }),

  // Add Template
  on(addTemplate, (state, { template }) => ({
    ...state,
    templates: [...state.templates, template],
  })),

  // Duplicate Template
  on(duplicateTemplate, (state, { template }) => {
    let title = template.title + " (Copy)";
    const sameNames = state.templates.filter((t) => t.title.includes(title));
    if (sameNames.length > 0) title += ` (${sameNames.length})`;
    const newTemplate = { ...template, id: getUniqueId(state.templates.map(t => t.id)), title };
    return {
      ...state,
      templates: [...state.templates, newTemplate],
    };
  }),

  // Update Template
  on(updateTemplate, (state, { template }) => ({
    ...state,
    templates: state.templates.map((t) =>
      t.id === template.id ? template : t
    ),
  })),

  // Delete Template
  on(deleteTemplate, (state, { template }) => ({
    ...state,
    templates: state.templates.filter((t) => t.id !== template.id),
  })),

  // Set Template as active
  on(setActiveTemplate, (state, { template }) => ({
    ...state,
    templates: state.templates.map((t) =>
      t.id === template.id ? { ...t, active: true } : { ...t, active: false }
    ),
  }))
);
