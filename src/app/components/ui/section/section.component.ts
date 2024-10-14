import { CdkDragHandle } from "@angular/cdk/drag-drop";
import { NgClass } from "@angular/common";
import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { InputContextmenuDirective } from "../../../directives/input-contextmenu.directive";
import { Section } from "../../../types/notecraftr";
import { Subscription } from "rxjs";

@Component({
  selector: "nc-section",
  standalone: true,
  imports: [
    NgClass,
    CheckboxModule,
    ReactiveFormsModule,
    DropdownModule,
    CdkDragHandle,
    CalendarModule,
    MultiSelectModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    InputContextmenuDirective,
  ],
  templateUrl: "./section.component.html",
  styleUrl: "./section.component.scss",
  providers: [],
})
export class SectionComponent implements OnInit, OnDestroy {
  section = input.required<Section>();
  linkedSectionsEnabled = input.required<boolean>();
  sectionsFilter = input.required<string>();
  visibleLinkedSections = input.required<Section[]>();
  onSectionUpdate = output<Section>();
  onSectionDelete = output<Section>();
  onSectionEditDialog = output<Section>();
  onCreateLinkedSection = output<Section>();
  onDuplicateSection = output<Section>();
  checkedFormControl = new FormControl<boolean>(false);
  actionsVisible = signal(false);
  dateFormControl = new FormControl<Date | null>(null);
  multiOptionsFormControl = new FormControl<{ label: string; value: string }[]>(
    []
  );
  singleOptionFormControl = new FormControl<{
    label: string;
    value: string;
  } | null>(null);
  inputFormControl = new FormControl<string>("");
  checked$: Subscription | undefined;
  multiOptionsChange$: Subscription | undefined;
  singleOptionChange$: Subscription | undefined;
  dateChange$: Subscription | undefined;
  inputChange$: Subscription | undefined;
  mouseEnter = output<Section>();
  mouseLeave = output<Section>();
  options = computed(() => {
    const sec = this.section();
    return sec.options.map((o) => {
      return { label: this.limitString(o, 20), value: o };
    });
  });
  linkedInfoVisible = computed(() => {
    const visibleLinkedSections = this.visibleLinkedSections();
    const sec = this.section();
    for (let i = 0; i < visibleLinkedSections.length; i++) {
      if (visibleLinkedSections[i].id === sec.id) return true;
    }
    return false;
  });
  multiselectLabel = computed(() => {
    const sec = this.section();
    return sec.multipleTextValue
      ? sec.multipleTextValue.length + " selected"
      : "Options";
  });

  dateHourFormat = computed<"12" | "24">(() => {
    const sec = this.section();
    const isCustomFormat = sec.dateFormat === "Custom";
    const format = isCustomFormat ? sec.customDateFormat : sec.dateFormat;

    return (format || "").includes("H") ? "24" : "12";
  });

  showSeconds = computed(() => {
    const sec = this.section();
    const isCustomFormat = sec.dateFormat === "Custom";
    const format = isCustomFormat ? sec.customDateFormat : sec.dateFormat;
    return (format || "").includes("s");
  });

  sectionChange$ = effect(
    () => {
      const section = this.section();
      const multipleTextValue = section.multipleTextValue || [];
      this.multiOptionsFormControl.patchValue(
        multipleTextValue.map((v) => {
          return { label: this.limitString(v, 20), value: v };
        }),
        { emitEvent: false }
      );
      this.checkedFormControl.patchValue(section.active, { emitEvent: false });
      this.dateFormControl.patchValue(section.dateValue || new Date(), {
        emitEvent: false,
      });
      this.singleOptionFormControl.patchValue(
        {
          label: this.limitString(section.singleTextValue || "", 20),
          value: section.singleTextValue || "",
        },
        { emitEvent: false }
      );
    },
    { allowSignalWrites: true }
  );

  ngOnInit(): void {
    this.checked$ = this.checkedFormControl.valueChanges.subscribe(
      (checked) => {
        this.setActive(checked || false);
      }
    );

    this.multiOptionsChange$ =
      this.multiOptionsFormControl.valueChanges.subscribe((v) => {
        this.setMultipleTextValue(v ? v.map((o) => o.value) : []);
      });

      this.singleOptionChange$ =
      this.singleOptionFormControl.valueChanges.subscribe((v) => {
        this.setSingleTextValue(v ? v.value : "");
      });

    this.dateChange$ = this.dateFormControl.valueChanges.subscribe((v) => {
      this.setDateValue(v || new Date());
    });

    this.inputChange$ = this.inputFormControl.valueChanges.subscribe((v) => {
      this.setInputValue(v || "");
    });

    this.checkedFormControl.patchValue(this.section().active, {
      emitEvent: false,
    });

    this.dateFormControl.patchValue(this.section().dateValue || new Date(), {
      emitEvent: false,
    });
    const multiOptions = this.section().multipleTextValue || [];
    this.multiOptionsFormControl.patchValue(
      multiOptions.map((o) => {
        return { label: this.limitString(o, 20), value: o };
      }),
      {
        emitEvent: false,
      }
    );
    const singleOption = this.section().singleTextValue || "";
    this.singleOptionFormControl.patchValue(
      { label: this.limitString(singleOption, 20), value: singleOption },
      {
        emitEvent: false,
      }
    );
    this.inputFormControl.patchValue(this.section().inputValue || "", {
      emitEvent: false,
    });
  }



  ngOnDestroy(): void {
    const subs = [
      this.multiOptionsChange$,
      this.checked$,
      this.inputChange$,
      this.singleOptionChange$,
      this.dateChange$,
    ];
    for (const sub of subs) {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  setActive(active: boolean) {
    this.onSectionUpdate.emit({...this.section(), active});
  }

  setSingleTextValue(singleTextValue: string | undefined) {
    this.onSectionUpdate.emit({...this.section(), singleTextValue});
  }

  setMultipleTextValue(multipleTextValue: string[] | undefined) {
    this.onSectionUpdate.emit({...this.section(), multipleTextValue});
  }

  setInputValue(inputValue: string | undefined) {
    this.onSectionUpdate.emit({...this.section(), inputValue});
  }

  setDateValue(dateValue: Date | undefined) {
    this.onSectionUpdate.emit({...this.section(), dateValue});

  }

  limitString(value: string, maxLength: number): string {
    return value.length > maxLength
      ? value.substring(0, maxLength) + "..."
      : value;
  }

  createLinkedSection() {
    // let templates = this.templates();
    // let template = templates.find((t) => t.active);
    // if (!template) return;
    // let section = this.section();
    // section.linked = true;
    // section.linkedId = section.linkedId !== -1 ? section.linkedId : section.id;
    // // this.notecraftrService.createLinkedSection(section, template);
    // // this.notecraftrService.saveTemplate(template, templates);
    // this.customMessage.showMessage.emit({
    //   severity: "success",
    //   summary: "Linked Section",
    //   detail: `Linked Section Created.`,
    // });

    this.onCreateLinkedSection.emit(this.section());
  }

  setActionVisible(value: boolean) {
    this.actionsVisible.set(value);
  }

  requestDeleteSection() {
    this.onSectionDelete.emit(this.section());

  }

  deleteSection() {
    this.onSectionDelete.emit(this.section());
  }

  duplicateSection() {
    this.onDuplicateSection.emit(this.section());
  }

  editSection() {
    this.onSectionEditDialog.emit(this.section());
  }

  onMouseEnter(event: MouseEvent) {
    this.mouseEnter.emit(this.section());
    this.setActionVisible(true);
  }

  onMouseLeave(event: MouseEvent) {
    this.mouseLeave.emit(this.section());
    this.setActionVisible(false);
  }
}
