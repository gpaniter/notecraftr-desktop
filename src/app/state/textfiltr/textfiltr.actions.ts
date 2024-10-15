import { createAction, props } from "@ngrx/store";

export const updateTargetText = createAction(
    '[Textfiltr] Update Target Text',
    props<{ text: string }>()
);

export const updateFilterNumbers = createAction(
    '[Textfiltr] Update Filter Numbers',
    props<{ enabled: boolean }>()
)

export const updateFilterLetters = createAction(
    '[Textfiltr] Update Filter Letters',
    props<{ enabled: boolean }>()
)

export const updateFilterSpecialCharacters = createAction(
    '[Textfiltr] Update Filter Special Characters',
    props<{ enabled: boolean }>()
)

export const updateFilterSpaces = createAction(
    '[Textfiltr] Update Filter Spaces',
    props<{ enabled: boolean }>()
)

export const updatePreviewVisible = createAction(
    '[Textfiltr] Update Preview Visible',
    props<{ enabled: boolean }>()
)