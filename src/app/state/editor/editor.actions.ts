import { createAction, props } from "@ngrx/store";
import { Section, Template } from "../../types/notecraftr";


export const loadTemplates = createAction(
    '[Editor] Load Templates',
    props<{ templates: Template[] }>()
);

export const addTemplate = createAction(
    '[Editor] Add Template',
    props<{ template: Template }>()
);

export const duplicateTemplate = createAction(
    '[Editor] Duplicate Template',
    props<{ template: Template }>()
)

export const updateTemplate = createAction(
    '[Editor] Update Template',
    props<{ template: Template }>()
);

export const deleteTemplate = createAction(
    '[Editor] Delete Template',
    props<{ template: Template }>()
);

export const setActiveTemplate = createAction(
    '[Editor] Set Active Template',
    props<{ template: Template }>()
);

export const setLastTemplateAsActive = createAction(
    '[Editor] Set Last Template As Active'
)

export const createDefaultTemplate = createAction(
    '[Editor] Create Default Template'
)

export const addSection = createAction(
    '[Editor] Add Section',
    props<{ template: Template }>()
);

export const duplicateSection = createAction(
    '[Editor] Duplicate Section',
    props<{ section: Section }>()
);

export const updateSection = createAction(
    '[Editor] Update Section',
    props<{ section: Section }>()
);

export const createLinkedSection = createAction(
    '[Editor] Create Linked Section',
    props<{ section: Section }>()
)

export const deleteSection = createAction(
    '[Editor] Delete Section',
    props<{ section: Section }>()
);

export const selectAllSections = createAction(
    '[Editor] Select All Sections',
    props<{ template: Template, enabled: boolean }>()
)

export const updateAllLinkedSections = createAction(
    '[Editor] Update All Linked Sections',
    props<{ section: Section }>()
)

export const updateSectionFilter = createAction(
    '[Editor] Update Section Filter',
    props<{ filter: string }>()
)

export const updatePreviewVisible = createAction(
    '[Editor] Update Preview Visible',
    props<{ visible: boolean }>()
)

