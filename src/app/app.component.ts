import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from './components/ui/menubar/menubar.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from "primeng/dynamicdialog";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { isMaximized, onResized } from './lib/notecraftr-tauri';
import { Store } from '@ngrx/store';
import * as WindowState from './state/window';
import { CustomMessageService } from './services/custom-message.service';
import { CustomDialogService } from './services/custom-dialog.service';
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
  messageChange$: Subscription | undefined;
  
  windowResize$: UnlistenFn | undefined;
  windowClose$: UnlistenFn | undefined;
  locationUnregister$: VoidFunction | undefined;

  themeChange$ = effect(() => {
    const t = this.theme();
    const linkEl = document.querySelector("link[rel='stylesheet']") as HTMLLinkElement;
    if (linkEl) {
      linkEl.href = `${t.theme}-${t.color}.css`;
    }
  })


  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true;
    this.windowResize$ = await onResized(({ payload: size }) => {
      this.checkWindowMaximized();
    });
    this.locationUnregister$ = this.location.onUrlChange((url) => {
      this.store.dispatch(WindowState.updateActiveUrl({ url }));
    });

    this.messageChange$ = this.message.subscribe((message) => {
      if (!message) return;
      this.messageService.add({ ...message, key: "bl" });
    });

    this.windowClose$ = await listen("tauri://close-requested", () => {
      // let notes = this.notesService.notes();
      // for (let i = 0; i < notes.length; i++) {
      //   notes[i].opened = false;
      // }
      // getAllWebviewWindows().then((windows) => {
      //   windows.forEach((w) => {
      //     let id = Number(w.label.split("-")[1]);
      //     for (let i = 0; i < notes.length; i++) {
      //       if (notes[i].id === id) notes[i].opened = true;
      //     }
      //   });
      // }).finally(() => {
      //   this.notesService.notes.set(notes);
      // })
    })
  }

  checkWindowMaximized() {
    isMaximized().then((maximized) => {
      if (maximized) {
        this.store.dispatch(WindowState.maximize());
        return
      }
      this.store.dispatch(WindowState.unmaximize());
    });
  }
}
