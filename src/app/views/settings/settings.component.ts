import { Component, inject, isDevMode, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { Subscription } from "rxjs";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputSwitchModule } from "primeng/inputswitch";
import { TooltipModule } from "primeng/tooltip";
import { DividerModule } from "primeng/divider";
import { emit } from "@tauri-apps/api/event";
import { ButtonModule } from "primeng/button";
import { RouterLink } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from "@ngrx/store";
import * as WindowState from "../../state/window";
import { Message } from "primeng/api";
import { isAutostartEnabled, setAutostart } from "../../lib/notecraftr-tauri";
@Component({
  selector: "nc-settings",
  standalone: true,
  imports: [
    DropdownModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputSwitchModule,
    TooltipModule,
    DividerModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent implements OnInit, OnDestroy {
  store = inject(Store);
  locationService = inject(Location);
  theme = this.store.selectSignal(WindowState.theme);
  linkedSectionsEnabled = this.store.selectSignal(WindowState.linkedSectionsEnabled);
  autoCopyOnTemplateChange = this.store.selectSignal(WindowState.autoCopyOnTemplateChange);
  autoCopyOnOutputChange = this.store.selectSignal(WindowState.autoCopyOnOutputChange);
  addonsEnabled = this.store.selectSignal(WindowState.addonsEnabled);
  themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
  ];
  colors = [
    { name: "Amber", value: "amber" },
    { name: "Blue", value: "blue" },
    { name: "Cyan", value: "cyan" },
    { name: "Green", value: "green" },
    { name: "Indigo", value: "indigo" },
    { name: "Lime", value: "lime" },
    { name: "Noir", value: "noir" },
    { name: "Pink", value: "pink" },
    { name: "Purple", value: "purple" },
    { name: "Teal", value: "teal" },
  ];

  themeFormControl = new FormControl<
    { name: string; value: string } | undefined
  >(undefined);
  colorFormControl = new FormControl<
    { name: string; value: string } | undefined
  >(undefined);
  autoCopyOnTemplateChangeFormControl = new FormControl<boolean>(false);
  autoCopyOnOutputChangeFormControl = new FormControl<boolean>(false);
  linkedSectionsEnabledFormControl = new FormControl<boolean>(false);
  runAtStartUpFormControl = new FormControl<boolean>(false);
  addonsEnabledFormControl = new FormControl<boolean>(false);
  themeChange$: Subscription | undefined;
  colorChange$: Subscription | undefined;
  autoCopyOnTemplateChange$: Subscription | undefined;
  autoCopyOnOutputChange$: Subscription | undefined;
  linkedSectionsEnabled$: Subscription | undefined;
  addonsEnabled$: Subscription | undefined;
  runAtStartUp$: Subscription | undefined;

  ngOnInit() {
    this.themeChange$ = this.themeFormControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.store.dispatch(WindowState.updateTheme({ theme: {...this.theme(), theme: value.value} }));
          const message: Message = { severity: "info", summary: "Theme", detail: "App theme changed." };
          this.store.dispatch(WindowState.showMessage({ message }));
          emit("custom-theme-change", this.theme());
        }
      }
    );
    this.colorChange$ = this.colorFormControl.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.store.dispatch(WindowState.updateTheme({ theme: {...this.theme(), color: value.value} }));
          const message: Message = { severity: "info", summary: "Color", detail: "App color changed." };
          this.store.dispatch(WindowState.showMessage({ message }));
          emit("custom-theme-change", this.theme());
        }
      }
    );
    this.linkedSectionsEnabled$ =
      this.linkedSectionsEnabledFormControl.valueChanges.subscribe((value) => {
        this.store.dispatch(WindowState.updateLinkedSectionsEnabled({ enabled: value || false }));
      });
    this.autoCopyOnTemplateChange$ =
      this.autoCopyOnTemplateChangeFormControl.valueChanges.subscribe(
        (value) => {
          this.store.dispatch(WindowState.updateAutoCopyOnTemplateChange({ enabled: value || false }));
        }
      );
    this.autoCopyOnOutputChange$ =
      this.autoCopyOnOutputChangeFormControl.valueChanges.subscribe((value) => {
        this.store.dispatch(WindowState.updateAutoCopyOnOutputChange({ enabled: value || false }));
      });
    this.runAtStartUp$ = this.runAtStartUpFormControl.valueChanges.subscribe(
      (value) => {
        if (!isDevMode()) {
          setAutostart(value || false);
        }
      }
    );
    this.addonsEnabled$ = this.addonsEnabledFormControl.valueChanges.subscribe(
      (value) => {
        this.store.dispatch(WindowState.updateAddonsEnabled({ enabled: value || false }));
      }
    );
    isAutostartEnabled().then((autoStart) => {
      this.runAtStartUpFormControl.patchValue(autoStart, { emitEvent: false });
    });
    this.themeFormControl.patchValue(
      this.themes.find((t) => t.value === this.theme().theme),
      { emitEvent: false }
    );
    this.colorFormControl.patchValue(
      this.colors.find((c) => c.value === this.theme().color),
      { emitEvent: false }
    );
    this.autoCopyOnTemplateChangeFormControl.patchValue(
      this.autoCopyOnTemplateChange(),
      { emitEvent: false }
    );
    this.autoCopyOnOutputChangeFormControl.patchValue(
      this.autoCopyOnOutputChange(),
      { emitEvent: false }
    );
    this.linkedSectionsEnabledFormControl.patchValue(
      this.linkedSectionsEnabled(),
      { emitEvent: false }
    );
    this.addonsEnabledFormControl.patchValue(this.addonsEnabled(), {
      emitEvent: false,
    });
  }

  async updateAutoStart() {}

  ngOnDestroy(): void {
    const subs = [
      this.themeChange$,
      this.runAtStartUp$,
      this.colorChange$,
      this.autoCopyOnTemplateChange$,
      this.linkedSectionsEnabled$,
      this.autoCopyOnOutputChange$,
      this.addonsEnabled$,
    ];
    for (let sub of subs) {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  onBackClick() {
    this.locationService.back();
  }
}
