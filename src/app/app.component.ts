import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from './components/ui/menubar/menubar.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from "primeng/dynamicdialog";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { isMaximized, onResized } from './lib/notecraftr-tauri';
import { Store } from '@ngrx/store';
import * as WindowActions from './state/window/window.actions';
import { CustomMessageService } from './services/custom-message.service';
import { CustomDialogService } from './services/custom-dialog.service';
import { Subscription } from 'rxjs';
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
  primengConfig = inject(PrimeNGConfig);
  customMessage = inject(CustomMessageService);
  customDialog = inject(CustomDialogService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);

  showMessage$: Subscription | undefined;
  
  windowResize$: UnlistenFn | undefined;
  windowClose$: UnlistenFn | undefined;


  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true;
    this.windowResize$ = await onResized(({ payload: size }) => {
      this.checkWindowMaximized();
    });

    this.showMessage$ = this.customMessage.showMessage.subscribe((message) => {
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
        this.store.dispatch(WindowActions.maximize());
        return
      }
      this.store.dispatch(WindowActions.unmaximize());
    });
  }
}
