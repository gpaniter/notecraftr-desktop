import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, input, model, OnDestroy, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { debounceTime, map, startWith, Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { TooltipModule } from 'primeng/tooltip';
import { DatabaseService } from '../../../services/database.service';
import { CustomMessageService } from '../../../services/custom-message.service';
import { Store } from '@ngrx/store';
import { writeTextToClipboard } from '../../../lib/notecraftr-tauri';
import * as WindowState from '../../../state/window';
import { Message } from 'primeng/api';

@Component({
  selector: 'nc-output-actions',
  standalone: true,
  imports: [ButtonModule, NgClass, TooltipModule, CommonModule],
  templateUrl: './output-actions.component.html',
  styleUrl: './output-actions.component.scss'
})
export class OutputActionsComponent implements OnInit, AfterViewInit, OnDestroy {
  store = inject(Store);
  customMessage = inject(CustomMessageService);
  allowAutoCopy = false;
  output = input.required<string>();
  previewVisible = input.required<boolean>();
  outputChange$ = toObservable(this.output);
  outputSubscription$: Subscription | undefined;
  autoCopyOnOutputChange = this.store.selectSignal(WindowState.autoCopyOnOutputChange);
  outputAnimationPhase = signal(false);
  isAnimationsVisible = signal(false);
  previewToggle = output<boolean>();

  ngOnInit(): void {
    this.outputSubscription$ = this.outputChange$
    .pipe(
      debounceTime(200),
    )
    .subscribe((v) => {
      this.outputAnimationPhase.update(v => !v);
      if (v && this.allowAutoCopy && this.autoCopyOnOutputChange()) {
        this.autoCopyOutputToClipboard();
      }
    });
    setTimeout(() => {
      this.isAnimationsVisible.set(true);
    }, 300);
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.allowAutoCopy = true;
    }, 300)
  }


  ngOnDestroy(): void {
    this.outputSubscription$?.unsubscribe();
  }

  togglePreview() {
    this.previewToggle.emit(!this.previewVisible());
  }

  copyOutput() {
    writeTextToClipboard(this.output()).then(() => {
      const message: Message = {
        severity: 'success',
        summary: 'Output Copied',
        detail: "Output copied to clipboard.",
      }
      this.store.dispatch(WindowState.showMessage({message}));
    })
  }

  autoCopyOutputToClipboard() {
    writeTextToClipboard(this.output()).then(() => {
      const message: Message = {
        severity: 'success',
        summary: 'Auto Copy',
        detail: "Output automatically copied to clipboard.",
      }
      this.store.dispatch(WindowState.showMessage({message}));
    })
  }
}
