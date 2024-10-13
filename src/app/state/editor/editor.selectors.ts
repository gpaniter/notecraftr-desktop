import { createSelector, MemoizedSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { EditorState } from "./editor.reducer";
import { Template } from "../../types/notecraftr";
import { formatDate } from "../../utils/helpers";

export const selectEditor = (state: AppState) => {
  return state.editor;
};

export const templates = createSelector(
  selectEditor,
  (state: EditorState) => state.templates
);

export const activeTemplate = createSelector(templates, (templates) => {
  for (let key in templates) {
    if (templates[key].active) {
      return templates[key];
    }
  }
  return null;
});
export const sectionsFilter = createSelector(
  selectEditor,
  (state: EditorState) => state.sectionsFilter
);

export const visibleSections = createSelector(
  activeTemplate,
  sectionsFilter,
  (template: Template | null, filter: string) => {
    if (template) {
      if (!filter) {
        return template.sections;
      }
      filter = filter.toLowerCase();
      return template.sections.filter((section) => {
        const matchTitle = section.title.toLowerCase().includes(filter);
        if (matchTitle) return true;
        const matchOptions = section.options.some((o) =>
          o.toLowerCase().includes(filter)
        );
        return matchOptions;
      });
    }
    return [];
  }
);

export const previewVisible = createSelector(
  selectEditor,
  (state: EditorState) => state.previewVisible
);

export const output = createSelector(
    activeTemplate,
    (template: Template | null) => {
  let output = "";
  if (!template) return output;
  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i];
    if (!section.active) continue;

    let textValue = section.prefix;

    switch (section.type) {
      case "single":
        textValue += section.singleTextValue || "";
        break;
      case "multiple":
        textValue += section.multipleTextValue
          ? section.multipleTextValue.join(section.separator || "")
          : "";
        break;
      case "date":
        const date = section.dateValue || new Date();
        const format = section.dateFormat || "MMMM/D/YYYY";
        const customDateFormat = section.customDateFormat || "";
        const isCustomFormat = format === "Custom";
        textValue += formatDate(
          date,
          isCustomFormat ? customDateFormat : format
        );
        break;
      case "input":
        textValue += section.inputValue || "";
        break;
    }
    textValue += section.suffix;
    output += textValue;
  }
  return output;
});
