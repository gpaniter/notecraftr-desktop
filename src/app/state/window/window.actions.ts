import { createAction, props } from "@ngrx/store";
import { Message } from "primeng/api";

export const minimize = createAction(
    '[Window] Minimize'
);

export const maximize = createAction(
    '[Window] Maximize'
);

export const unmaximize = createAction(
    '[Window] Unmaximize'
);

export const close = createAction(
    '[Window] Close'
);

export const focus = createAction(
    '[Window] Focus'
);

export const blur = createAction(
    '[Window] Blur'
);

export const updateTheme = createAction(
    '[Window] Update Theme',
    props<{ theme: {theme: string, color: string} }>()
);

export const showMessage = createAction(
    '[Window] Show Message',
    props<{ message: Message }>()
)

export const updateActiveUrl = createAction(
    '[Window] Update Active Url',
    props<{ url: string }>()
)

export const updateAutoCopyOnTemplateChange = createAction(
    '[Window] Update Auto Copy On Template Change',
    props<{ enabled: boolean }>()
)

export const updateAutoCopyOnOutputChange = createAction(
    '[Window] Update Auto Copy On Output Change',
    props<{ enabled: boolean }>()
)

export const updateLinkedSectionsEnabled = createAction(
    '[Window] Update Linked Sections Enabled',
    props<{ enabled: boolean }>()
)

export const updateAddonsEnabled = createAction(
    '[Window] Update Addons Enabled',
    props<{ enabled: boolean }>()
)
