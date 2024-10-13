import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogData } from '../../../types/notecraftr';

@Component({
  selector: 'nc-confirm-dialog',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  dialogRef = inject(DynamicDialogRef);
  dialogConfig = inject(DynamicDialogConfig);

  data: ConfirmDialogData = this.dialogConfig.data;


  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
