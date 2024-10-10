import { EditorState } from "./editor/editor.reducer"
import { WindowState } from "./window/window.reducer"

export type AppState = {
    window: WindowState,
    editor: EditorState,
}