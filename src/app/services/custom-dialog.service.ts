import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogData, Section, Template } from '../types/notecraftr';
import { ConfirmDialogComponent } from '../components/ui/confirm-dialog/confirm-dialog.component';
import { TemplateEditDialogComponent } from '../components/ui/template-edit-dialog/template-edit-dialog.component';
import { SectionEditDialogComponent } from '../components/ui/section-edit-dialog/section-edit-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {

  openConfirmDialog(
    service: DialogService,
    data: ConfirmDialogData,
    confirmCallback?: (value: boolean) => void,
    cancelCallback?: (value: boolean) => void
  ) {
    const ref = service.open(ConfirmDialogComponent, {
      header: data.header,
      dismissableMask: true,
      data: data,
      appendTo: "body",
    });
    const sub$ = ref.onClose.subscribe((value: boolean | undefined) => {
      sub$.unsubscribe();
  
      if (value && confirmCallback) confirmCallback(value);
      else if (!value && cancelCallback) cancelCallback(false);
    });
  }

  openTemplateEditDialog(
    service: DialogService,
    template: Template,
    confirmCallback?: (newTemplate: Template) => void,
    cancelCallback?: (value: boolean) => void
  ) {
    const ref = service.open(TemplateEditDialogComponent, {
      header: "Edit Template",
      data: template,
      dismissableMask: true,
    });
    const sub$ = ref.onClose.subscribe((value: Template | undefined) => {
      sub$.unsubscribe();
      if (value && confirmCallback) confirmCallback(value);
      else if (!value && cancelCallback) cancelCallback(false);
    });
  }

  openSectionEditDialog(
    service: DialogService,
    section: Section,
    confirmCallback?: (newSection: Section) => void,
    cancelCallback?: (value: boolean) => void
  ) {
    const ref = service.open(SectionEditDialogComponent, {
      header: "Edit Section",
      data: section,
      dismissableMask: true,
      // styleClass: section.backgroundClass,
      // maskStyleClass: section.backgroundClass,
      // closable: false,
      // // showHeader: false,
      contentStyle: {
      //   // backgroundColor: "black",
        paddingBottom: "0px",
        paddingTop: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
      }
    });
    const sub$ = ref.onClose.subscribe((value: Section | undefined) => {
      if (value && confirmCallback) confirmCallback(value);
      else if (!value && cancelCallback) cancelCallback(false);
      // this.requestCheck.emit();
      sub$.unsubscribe();
    });
  }
}
