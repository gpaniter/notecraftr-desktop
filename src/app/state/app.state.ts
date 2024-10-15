import { EditorState } from "./editor/editor.reducer"
import { TextFiltrState } from "./textfiltr"
import { WindowState } from "./window/window.reducer"

export type AppState = {
    window: WindowState,
    editor: EditorState,
    textFiltr: TextFiltrState
}