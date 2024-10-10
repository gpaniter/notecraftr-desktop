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

export const addSection = createAction(
    '[Editor] Add Section',
    props<{ section: Section }>()
);

export const duplicateSection = createAction(
    '[Editor] Duplicate Section',
    props<{ section: Section }>()
);

export const updateSection = createAction(
    '[Editor] Update Section',
    props<{ section: Section }>()
);

export const deleteSection = createAction(
    '[Editor] Delete Section',
    props<{ section: Section }>()
);
