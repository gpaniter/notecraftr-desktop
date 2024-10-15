import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, Subscription } from "rxjs";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputSwitchModule } from "primeng/inputswitch";
import { FloatLabelModule } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { Location } from "@angular/common";
import { Store } from "@ngrx/store";
import * as TextFiltrState from "../../../state/textfiltr";
import * as WindowState from "../../../state/window";
import { InputContextmenuDirective } from "../../../directives/input-contextmenu.directive";
import { OutputActionsComponent } from "../../../components/ui/output-actions/output-actions.component";
import { readTextFromClipboard } from "../../../lib/notecraftr-tauri";
import { Message } from "primeng/api";
@Component({
  selector: "nc-textfiltr",
  standalone: true,
  imports: [
    OutputActionsComponent,
    ReactiveFormsModule,
    InputTextareaModule,
    InputSwitchModule,
    FloatLabelModule,
    DividerModule,
    ButtonModule,
    TooltipModule,
    InputContextmenuDirective
  ],
  templateUrl: "./textfiltr.component.html",
  styleUrl: "./textfiltr.component.scss",
})
export class TextFiltrComponent implements OnInit, OnDestroy {
  store = inject(Store);
  locationService = inject(Location);
  input = this.store.selectSignal(TextFiltrState.targetText);
  filterNumbers = this.store.selectSignal(TextFiltrState.filterNumbers);
  filterLetters = this.store.selectSignal(TextFiltrState.filterLetters);
  filterSpecialCharacters = this.store.selectSignal(TextFiltrState.filterSpecialCharacters);
  filterSpaces = this.store.selectSignal(TextFiltrState.filterSpaces);
  previewVisible = this.store.selectSignal(TextFiltrState.previewVisible);
  output = this.store.selectSignal(TextFiltrState.output);
  inputFormControl = new FormControl<string>("");
  filterNumbersFormControl = new FormControl<boolean>(false);
  filterLettersFormControl = new FormControl<boolean>(false);
  filterSpecialCharactersFormControl = new FormControl<boolean>(false);
  filterSpacesFormControl = new FormControl<boolean>(false);
  inputChange$: Subscription | undefined;
  filterNumbersChange$: Subscription | undefined;
  filterLettersChange$: Subscription | undefined;
  filterSpecialCharactersChange$: Subscription | undefined;
  filterSpacesChange$: Subscription | undefined;


  
  ngOnInit(): void {
    this.inputChange$ = this.inputFormControl.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(
      (value) => {
        this.store.dispatch(TextFiltrState.updateTargetText({text: value || ""}));
      }
    );
    this.filterNumbersChange$ =
      this.filterNumbersFormControl.valueChanges.subscribe((value) => {
        this.store.dispatch(TextFiltrState.updateFilterNumbers({enabled: value || false}));
      });
    this.filterLettersChange$ =
      this.filterLettersFormControl.valueChanges.subscribe((value) => {
        this.store.dispatch(TextFiltrState.updateFilterLetters({enabled: value || false}));
      });
    this.filterSpecialCharactersChange$ =
      this.filterSpecialCharactersFormControl.valueChanges.subscribe(
        (value) => {
          this.store.dispatch(TextFiltrState.updateFilterSpecialCharacters({enabled: value || false}));
        }
      );
    this.filterSpacesChange$ =
      this.filterSpacesFormControl.valueChanges.subscribe((value) => {
        this.store.dispatch(TextFiltrState.updateFilterSpaces({enabled: value || false}));
      });
    this.inputFormControl.patchValue(this.input(), { emitEvent: false });
    this.filterNumbersFormControl.patchValue(this.filterNumbers(), {
      emitEvent: false,
    });
    this.filterLettersFormControl.patchValue(this.filterLetters(), {
      emitEvent: false,
    });
    this.filterSpecialCharactersFormControl.patchValue(
      this.filterSpecialCharacters(),
      { emitEvent: false }
    );
    this.filterSpacesFormControl.patchValue(this.filterSpaces(), {
      emitEvent: false,
    });
  }

  ngOnDestroy(): void {
    const subs = [
      this.inputChange$,
      this.filterNumbersChange$,
      this.filterLettersChange$,
      this.filterSpecialCharactersChange$,
      this.filterSpacesChange$,
    ];
    for (let sub of subs) {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  paste(): void {
    readTextFromClipboard().then((text) => {
      this.inputFormControl.patchValue(text, { emitEvent: true });
      const message: Message = {
        severity: 'info',
        summary: 'Quick Paste',
        detail: "Paste text from Clipboard.",
      }
      this.store.dispatch(WindowState.showMessage({message}));
    })
  }

  onBackClick() {
    this.locationService.back();
  }

  onPreviewToggle() {
    const enabled = !this.previewVisible();
    this.store.dispatch(TextFiltrState.updatePreviewVisible({enabled}));
  }
}
