import { Component, inject, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FloatLabelModule } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { TooltipModule } from "primeng/tooltip";
import { TableModule } from "primeng/table";
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  CdkDragHandle,
} from "@angular/cdk/drag-drop";
import { DropdownModule } from "primeng/dropdown";
import { InplaceModule } from "primeng/inplace";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputContextmenuDirective } from "../../../directives/input-contextmenu.directive";
import { Section } from "../../../types/notecraftr";

@Component({
  selector: "nc-section-edit-dialog",
  standalone: true,
  imports: [
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    SelectButtonModule,
    InputContextmenuDirective,
    DropdownModule,
    TooltipModule,
    InplaceModule,
    TableModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: "./section-edit-dialog.component.html",
  styleUrl: "./section-edit-dialog.component.scss",
})
export class SectionEditDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  dialogConfig = inject(DynamicDialogConfig);
  data: Section = structuredClone(this.dialogConfig.data);
  titleFormControl = new FormControl();
  prefixFormControl = new FormControl();
  suffixFormControl = new FormControl();
  separatorFormControl = new FormControl();
  typeOptions: { label: string; value: Section["type"]; disabled: boolean }[] =
    [
      { label: "Single", value: "single", disabled: false },
      { label: "Multiple", value: "multiple", disabled: false },
      { label: "Input", value: "input", disabled: false },
      { label: "Date", value: "date", disabled: false },
    ];
  typeFormControl = new FormControl();
  dateFormatFormControl = new FormControl<string>("");
  customDateFormatFormControl = new FormControl<string>("");
  dateFormatOptions = [
    "Custom",
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY/MM/DD",
    "DD-MM-YYYY",
    "MM-DD-YYYY",
    "YYYY-MM-DD",
    "DD MMM YYYY",
    "MMM DD YYYY",
    "YYYY DD MMM",
    "DD MMMM YYYY",
    "MMMM DD YYYY",
    "YYYY MMMM DD",
    "MMMM Do, YYYY",
    "Do MMMM YYYY",
    "YYYY-MM-DD HH:mm:ss",
    "MMMM DD, YYYY h:mm A",
    "MM/DD/YY hh:mm:ss A",
  ];
  customDateReference: {code: string, exampleOutput: string, description: string}[] = [
    {
      code: "DD",
      exampleOutput: "01",
      description: "Day with leading zero"
    },
    // {
    //   code: "D",
    //   exampleOutput: "1",
    //   description: "Day without leading zero"
    // },
    {
      code: "Do",
      exampleOutput: "1st",
      description: "Day with an ordinal suffix"
    },
    {
      code: "MMMM",
      exampleOutput: "January",
      description: "Full month name"
    },
    {
      code: "MMM",
      exampleOutput: "Jan",
      description: "Abbreviated month name"
    },
    {
      code: "MM",
      exampleOutput: "01",
      description: "Month with leading zero"
    },
    // {
    //   code: "M",
    //   exampleOutput: "1",
    //   description: "Month without leading zero"
    // },
    {
      code: "YYYY",
      exampleOutput: "2023",
      description: "Full year with four digits"
    },
    {
      code: "YY",
      exampleOutput: "23",
      description: "Year with two digits"
    },
    {
      code: "hh",
      exampleOutput: "01",
      description: "Hour in 12-hour format with leading zero"
    },
    {
      code: "h",
      exampleOutput: "1",
      description: "Hour in 12-hour format without leading zero"
    },
    {
      code: "HH",
      exampleOutput: "13",
      description: "Hour in 24-hour format with leading zero"
    },
    {
      code: "mm",
      exampleOutput: "01",
      description: "Minute with leading zero"
    },
    {
      code: "m",
      exampleOutput: "1",
      description: "Minute without leading zero"
    },
    {
      code: "ss",
      exampleOutput: "01",
      description: "Second with leading zero"
    },
    {
      code: "s",
      exampleOutput: "1",
      description: "Second without leading zero"
    },
    {
      code: "A",
      exampleOutput: "AM",
      description: "AM/PM indicator"
    },
  ]
  options = signal<string[]>([]);
  hoveredOptionIndex = signal<number>(-1);

  ngOnInit(): void {
    this.options.set(this.data.options);
    this.titleFormControl.setValue(this.data.title, { emitEvent: true });
    this.typeFormControl.setValue(this.data.type, { emitEvent: true });
    this.prefixFormControl.setValue(this.data.prefix, { emitEvent: true });
    this.suffixFormControl.setValue(this.data.suffix, { emitEvent: true });
    this.separatorFormControl.setValue(this.data.separator, {
      emitEvent: true,
    });
    this.dateFormatFormControl.setValue(this.data.dateFormat || "DD/MM/YYYY", {
      emitEvent: true,
    });
    this.customDateFormatFormControl.setValue(this.data.customDateFormat || "", {emitEvent: false});
  }

  confirm() {
    const opt = this.options();
    this.data.multipleTextValue = this.keepSimilarItemsFromArrays(
      opt,
      this.data.multipleTextValue || []
    );
    if (this.data.singleTextValue) {
      if (!opt.includes(this.data.singleTextValue)) {
        this.data.singleTextValue = "";
      }
    }
    if (!this.data.dateValue) {
      this.data.dateValue = new Date();
    }

    this.dialogRef.close({
      ...this.data,
      title: this.titleFormControl.value || "",
      type: this.typeFormControl.value || "single",
      prefix: this.prefixFormControl.value || "",
      suffix: this.suffixFormControl.value || "",
      separator: this.separatorFormControl.value || "",
      dateFormat: this.dateFormatFormControl.value || "DD/MM/YYYY",
      customDateFormat: this.customDateFormatFormControl.value || "",
      options: this.options(),
    } as Section);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  optionDrop(event: CdkDragDrop<string[]>) {
    const options = this.options();
    moveItemInArray(options, event.previousIndex, event.currentIndex);
    this.options.update((options) => [...options]);
  }

  onOptionInput(event: Event, index: number) {
    const value = (event.target as HTMLInputElement).value;
    const options = this.options();
    options[index] = value;
    this.options.set([...options]);
  }

  deleteOption(event: Event, index: number) {
    const options = this.options();
    options.splice(index, 1);
    this.options.set([...options]);
  }

  addNewOption() {
    this.options.update((options) => [...options, ""]);
  }

  setOptionHovered(index: number) {
    this.hoveredOptionIndex.set(index);
  }

  keepSimilarItemsFromArrays(arrayA: string[], arrayB: string[]) {
    return arrayA.filter((item) => arrayB.includes(item));
  }
}
