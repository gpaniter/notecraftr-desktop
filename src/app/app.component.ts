import {
  Component,
  effect,
  HostListener,
  inject,
  isDevMode,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenubarComponent } from "./components/ui/menubar/menubar.component";
import { ToastModule } from "primeng/toast";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import {
  getAllNoteCraftrWindows,
  getWindowFocused,
  getWindowPosition,
  isMaximized,
  onFocusChanged,
  onMoved,
  onResized,
} from "./lib/notecraftr-tauri";
import { Store } from "@ngrx/store";
import * as WindowState from "./state/window";
import { CustomMessageService } from "./services/custom-message.service";
import { CustomDialogService } from "./services/custom-dialog.service";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { Note } from "./types/notecraftr";
import * as NotesState from "./state/notes";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenubarComponent, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [MessageService, DialogService],
})
export class AppComponent implements OnInit {
  store = inject(Store);
  location = inject(Location);
  theme = this.store.selectSignal(WindowState.theme);
  primengConfig = inject(PrimeNGConfig);
  customMessage = inject(CustomMessageService);
  customDialog = inject(CustomDialogService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  message = this.store.select(WindowState.message);
  notes = this.store.selectSignal(NotesState.notes);

  messageChange$: Subscription | undefined;
  windowResize$: UnlistenFn | undefined;
  windowClose$: UnlistenFn | undefined;
  windowFocus$: UnlistenFn | undefined;
  windowMove$: UnlistenFn | undefined;
  noteChange$: UnlistenFn | undefined;
  noteWindowMove$: UnlistenFn | undefined;
  noteWindowResize$: UnlistenFn | undefined;
  noteCreateRequest$: UnlistenFn | undefined;
  locationUnregister$: VoidFunction | undefined;

  themeChange$ = effect(() => {
    const t = this.theme();
    const linkEl = document.querySelector(
      "link[rel='stylesheet']"
    ) as HTMLLinkElement;
    if (linkEl) {
      linkEl.href = `${t.theme}-${t.color}.css`;
    }
  });

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true;

    await this.setupWindow();

    // Active Url
    this.locationUnregister$ = this.location.onUrlChange((url) => {
      this.store.dispatch(WindowState.updateActiveUrl({ url }));
    });
    const initialPath = this.location.path();
    this.store.dispatch(WindowState.updateActiveUrl({ url: initialPath }));

    this.messageChange$ = this.message.subscribe((message) => {
      if (!message) return;
      this.messageService.add({ ...message, key: "bl" });
    });

    if (!/note-window/g.test(initialPath)) {
      await this.setupNotePreviewWindowListeners();
    }
  }

  ngOnDestroy(): void {
    const unlistens = [
      this.windowResize$,
      this.windowClose$,
      this.windowFocus$,
      this.windowMove$,
      this.noteCreateRequest$,
      this.locationUnregister$,
      this.noteChange$,
      this.noteWindowMove$,
      this.noteWindowResize$,
    ];
    unlistens.forEach((unlisten) => {
      if (unlisten) {
        unlisten();
      }
    });

    const subs = [this.messageChange$];
    subs.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  @HostListener("contextmenu", ["$event"])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  async setupWindow() {
    // Window

    this.windowResize$ = await onResized(({ payload: size }) => {
      this.store.dispatch(WindowState.updateSize({ size }));
      // Check if window is maximized
      this.checkWindowMaximized();
    });
    this.checkWindowMaximized();

    this.windowMove$ = await onMoved(
      (e: { payload: { x: number; y: number } }) => {
        this.store.dispatch(
          WindowState.updatePosition({
            position: { x: e.payload.x, y: e.payload.y },
          })
        );
      }
    );
    getWindowPosition().then((position) => {
      this.store.dispatch(WindowState.updatePosition({ position }));
    });
    this.windowFocus$ = await onFocusChanged(({ payload: focused }) => {
      this.store.dispatch(WindowState.updateBlurred({ blurred: !focused }));
    });
    getWindowFocused().then((focused) => {
      this.store.dispatch(WindowState.updateBlurred({ blurred: !focused }));
    });
    
    this.noteWindowResize$ = await listen("note-window-size", (e) => {
      const payload = e.payload as {
        url: string;
        size: { width: number; height: number };
      };
      const noteId = Number(payload.url.split("/").pop());
      let note = this.notes().find((n) => n.id === noteId);
      if (note) {
        this.store.dispatch(
          NotesState.updateNote({
            note: { ...note, width: payload.size.width, height: payload.size.height },
          })
        );
      }
    });
    this.noteWindowMove$ = await listen("note-window-position", (e) => {
      const payload = e.payload as {
        url: string;
        position: { x: number; y: number };
      };
      const noteId = Number(payload.url.split("/").pop());
      let note = this.notes().find((n) => n.id === noteId);
      if (note) {
        this.store.dispatch(
          NotesState.updateNote({
            note: { ...note, x: payload.position.x, y: payload.position.y },
          })
        );
      }
    });
  }

  async setupNotePreviewWindowListeners() {
    this.noteChange$ = await listen("note-change", (e) => {
      this.store.dispatch(NotesState.updateNote({ note: e.payload as Note }));
    });

    this.windowClose$ = await listen("tauri://destroyed", () => {
      let notes = structuredClone(this.notes());
      notes = notes.map((n) => ({ ...n, opened: false }));
      getAllNoteCraftrWindows().then((windows) => {
        windows.forEach((w) => {
          let id = Number(w.label.split("-")[1]);
          let note = notes.find((n) => n.id === id);
          if (note) {
            note.opened = true;
          }
        });
        this.store.dispatch(NotesState.updateNotes({ notes }));
      });
    });

    this.noteCreateRequest$ = await listen("request-note-create", () => {
      this.store.dispatch(NotesState.addNote());
      const notes = this.notes();
      const latestNote = notes.length > 0 ? notes[notes.length - 1] : undefined;
      if (latestNote) this.openNote(latestNote);
    });
  }

  checkWindowMaximized() {
    isMaximized().then((maximized) => {
      if (maximized) {
        this.store.dispatch(WindowState.maximize());
        return;
      }
      this.store.dispatch(WindowState.unmaximize());
    });
  }

  async openNote(note: Note) {
    const hasScreenPos = !!(note.x || note.y);
    const webview = new WebviewWindow(`note-${note.id}`, {
      url: isDevMode()
        ? `http://localhost:4200/note-window/${note.id}`
        : `tauri://localhost/note-window/${note.id}`,
      decorations: false,
      width: note.width || 200,
      height: note.height || 200,
      minHeight: 75,
      minWidth: 200,
      theme: "light",
      title: "Notes",
      center: !hasScreenPos,
      x: note.x ? note.x + 10 : undefined,
      y: note.y ? note.y + 10 : undefined,
    });
    const un = await webview.once("tauri://created", (e) => {
      this.store.dispatch(
        NotesState.updateNote({ note: { ...note, opened: true } })
      );
      un();
    });
  }
}
