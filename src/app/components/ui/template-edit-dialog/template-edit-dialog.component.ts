import { Component, inject } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputContextmenuDirective } from "../../../directives/input-contextmenu.directive";
import { Template } from "../../../types/notecraftr";

@Component({
  selector: "nc-template-edit-dialog",
  standalone: true,
  imports: [
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    InputContextmenuDirective
  ],
  templateUrl: "./template-edit-dialog.component.html",
  styleUrl: "./template-edit-dialog.component.scss",
})
export class TemplateEditDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  dialogConfig = inject(DynamicDialogConfig);
  data: Template = this.dialogConfig.data;
  titleFormControl = new FormControl("");

  ngOnInit(): void {
    this.titleFormControl.setValue(this.data.title, { emitEvent: true });
  }

  confirm() {
    this.dialogRef.close({
      ...this.data,
      title: this.titleFormControl.value || "",
    } as Template);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
