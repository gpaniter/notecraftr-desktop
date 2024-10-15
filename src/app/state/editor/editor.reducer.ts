import { createReducer, on } from "@ngrx/store";
import { Section, Template } from "../../types/notecraftr";
import {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setActiveTemplate,
  duplicateTemplate,
  loadTemplates,
  selectAllSections,
  updateSectionFilter,
  addSection,
  updateAllLinkedSections,
  updatePreviewVisible,
  setLastTemplateAsActive,
  createDefaultTemplate,
  createLinkedSection,
  updateSection,
  deleteSection,
  duplicateSection,
} from "./editor.actions";
import { getFromDatabase, getUniqueId } from "../../utils/helpers";

export type EditorState = {
  templates: Template[];
  previewVisible: boolean;
  sectionsFilter: string;
  output: string;
};

export const editorInitialState: EditorState = {
  templates: getFromDatabase<Template[]>("notecraftr-templates") || [],
  previewVisible:
    getFromDatabase<boolean>("notecraftr-preview-visible") || false,
  sectionsFilter: getFromDatabase<string>("notecraftr-sections-filter") || "",
  output: "",
};

export const editorReducer = createReducer(
  editorInitialState,

  // Load Templates
  on(loadTemplates, (state, { templates }) => {
    return { ...state, templates };
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
    if (sameNames.length > 0) {
      title += ` (${sameNames.length})`
    };
    const id = getUniqueId(state.templates.map((t) => t.id))
    const newTemplate: Template = {
      ...template,
      id,
      title,
      sections: template.sections.map(s => ({...s, templateId: id}))
    };
    return {
      ...state,
      templates: [...state.templates, newTemplate],
    };
  }),

  // Set last template as active
  on(setLastTemplateAsActive, (state) => {
    return {
      ...state,
      templates: state.templates.map((t, i) => ({
        ...t,
        active: i === state.templates.length - 1,
      })),
    };
  }),

  // Update Template
  on(updateTemplate, (state, { template }) => ({
    ...state,
    templates: state.templates.map((t) =>
      t.id === template.id ? template : t
    ),
  })),

  // Create Default template
  on(createDefaultTemplate, (state) => {
    return {
      ...state,
      templates: [newTemplate("Default Template"), ...state.templates],
    };
  }),

  // Delete Template
  on(deleteTemplate, (state, { template }) => ({
    ...state,
    templates: state.templates.filter((t) => t.id !== template.id),
  })),

  // Set Template as active, then deactivate remaining templates
  on(setActiveTemplate, (state, { template }) => {
    return {
      ...state,
      templates: state.templates.map((t) => ({
        ...t,
        active: t.id === template.id,
      })),
    };
  }),

  // Select all sections: {[key: number]: Section} in the active Template
  on(selectAllSections, (state, { template, enabled }) => ({
    ...state,
    templates: state.templates.map((t) =>
      t.id === template.id
        ? {
            ...t,
            sections: t.sections.map((s) => ({ ...s, active: enabled })),
          }
        : t
    ),
  })),

  // Update section filter
  on(updateSectionFilter, (state, { filter }) => {
    return {
      ...state,
      sectionsFilter: filter,
    };
  }),

  // Update Section
  on(updateSection, (state, { section }) => {
    return {
      ...state,
      templates: state.templates.map((t) =>
        t.id === section.templateId
          ? {
              ...t,
              sections: t.sections.map((s) =>
                s.id === section.id ? section : s
              ),
            }
          : t
      ),
    };
  }),

  // Update all linked sections
  on(updateAllLinkedSections, (state, { section }) => {
    let templates = structuredClone(state.templates);

    for (let i = 0; i < templates.length; i++) {
      if (templates[i].active) {
        for (let j = 0; j < templates[i].sections.length; j++) {
          let sec = templates[i].sections[j];
          const isSameId = sec.id === section.id;
          const isLinked = sec.linked && sec.linkedId !== -1;
          const islinkedParent = isLinked && section.linkedId === sec.id;
          const isLinkedChildren =
            isLinked && !islinkedParent && section.linkedId === sec.linkedId;

          if (isLinked && (isSameId || islinkedParent || isLinkedChildren)) {
            templates[i].sections[j] = {
              ...section,
              id: sec.id,
              linked: sec.linked,
              linkedId: sec.linkedId,
            };
          }
        }
      }
    }
    return { ...state, templates };
  }),

  // Add section
  on(addSection, (state, { template }) => {
    const section = newSection("New Section", template);
    return {
      ...state,
      templates: state.templates.map((t) =>
        t.id === template.id ? { ...t, sections: [...t.sections, section] } : t
      ),
    };
  }),

  // Duplicate section
  on(duplicateSection, (state, { section }) => ({
    ...state,
    templates: state.templates.map((t) =>
      t.id === section.templateId
        ? {
            ...t,
            sections: [
              ...t.sections,
              {
                ...section,
                title: section.title + " (Copy)",
                id: getUniqueId(t.sections.map((s) => s.id)),
              },
            ],
          }
        : t
    ),
  })),

  // Delete section
  on(
    deleteSection,
    (state, { section }) => {
      let template = structuredClone(state.templates.find((t) => t.active));
      if (!template) return state;
      template.sections = template.sections
        .filter((s) => s.id !== section.id)
        .map((s) =>
          s.linkedId == section.id ? { ...s, linkedId: -1, linked: false } : s
        );

      // Check if linked parent exist
      const linkedParent = template.sections.find(
        (s) => s.id === section.linkedId
      );
      if (linkedParent) {
        const linkedChildren = template.sections.filter(
          (s) => s.linkedId === linkedParent.id && s.id !== s.linkedId
        );
        if (linkedChildren.length <= 0) {
          // Remove parent attribute
          template.sections = template.sections.map((s) =>
            s.id === linkedParent.id ? { ...s, linked: false, linkedId: -1 } : s
          );
        }
      }

      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === section.templateId ? template : t
        ),
      };
    }

    // ({
    //   ...state,
    //   templates: state.templates.map((t) =>
    //     t.id === section.templateId
    //       ? {
    //           ...t,
    //           sections: t.sections
    //             .filter((s) => s.id !== section.id)
    //             .map((s) =>
    //               s.linkedId == section.id
    //                 ? { ...s, linkedId: -1, linked: false }
    //                 : s
    //             ),
    //         }
    //       : t
    //   ),
    // })
  ),

  // Create Linked Section
  on(createLinkedSection, (state, { section }) => {
    const template = state.templates.find((t) => t.active);
    if (!template) return state;
    const linkedSection = {
      ...section,
      id: getUniqueId(template.sections.map((s) => s.id)),
      linked: true,
      linkedId: section.linkedId !== -1 ? section.linkedId : section.id,
    };
    return {
      ...state,
      templates: state.templates.map((t) =>
        t.id === template.id
          ? { ...t, sections: [...t.sections, linkedSection] }
          : t
      ),
    };
  }),

  // Toogle Preview
  on(updatePreviewVisible, (state, { visible }) => ({
    ...state,
    previewVisible: visible,
  }))
);

function newTemplate(
  title: string = "New Template",
  templates: Template[] = []
): Template {
  const idReference = templates.map((template) => template.id);
  const titleReference = templates.map((template) => template.title);
  const numberOccured = titleReference.filter((title) =>
    title.includes(title)
  ).length;
  if (numberOccured > 0) {
    title = `${title} (${numberOccured})`;
  }
  return {
    title: title,
    id: getUniqueId(idReference),
    active: true,
    sections: [],
  };
}

function newSection(title = "New Section", template: Template): Section {
  const idReference = template.sections.map((section) => section.id);
  const titleReference = template.sections.map((section) => section.title);
  const numberOccured = titleReference.filter((title) =>
    title.includes(title)
  ).length;
  if (numberOccured > 0) {
    title = `${title} (${numberOccured})`;
  }
  return {
    title: title,
    type: "single",
    id: getUniqueId(idReference),
    templateId: template.id,
    linked: false,
    linkedId: -1,
    active: true,
    options: [],
    separator: "",
    prefix: "",
    suffix: "",
    singleTextValue: "",
    backgroundClass: `card-bg-${Math.floor(Math.random() * 12) + 1}`, //12 bg in styles.cs
  };
}
