import { createAction, props } from "@ngrx/store";

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
