import { Component, computed, HostListener, signal } from '@angular/core';
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { MenuItem } from "primeng/api";
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from "primeng/tooltip";
import { NgClass } from "@angular/common";

import { Template } from '../../../types/notecraftr';
import { closeWindow, emitToWindows, fileSrcToUrl, maximizeWindow, minimizeWindow, startDragging, unmaximizeWindow, writeTextToClipboard } from '../../../lib/notecraftr-tauri';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'nc-menubar',
  standalone: true,
  imports: [RippleModule, MenuModule, ButtonModule, TooltipModule, NgClass],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
  providers: [DialogService]
})
export class MenubarComponent {
  output = signal("");
  autoCopyOnTemplateChange = signal(false);
  autoCopyOnOutputChange = signal(false);
  addonsEnabled = signal(false);
  activeUrl = signal("");
  isMaximized = signal(false);
  templates = signal<Template[]>([]);
  activeTemplate = signal<Template | null>(null);
  appIcon = signal("");
  mouseHovered = signal(false);
  closeButtonHovered = signal(false);
  notePreviewWindowMode = computed(() => {
    const url = this.activeUrl();
    return /note-window/g.test(url)
  })
  editorMode = computed(() => {
    const url = this.activeUrl();
    return ["", "/", "/editor"].includes(url)
  })
  windowBlured = signal(false);

  templateMenuItems = computed<MenuItem[]>(() => {
    const templates = this.templates();
    const activeTemplate = this.activeTemplate();
    const activeFirst = activeTemplate ? [activeTemplate] : [];
    const filteredTemplates = activeFirst.concat(templates.filter((t) => activeTemplate && activeTemplate.id !== t.id));
    return [...filteredTemplates
    // .filter((t) => activeTemplate && activeTemplate.id !== t.id)
    .map((t) => ({
      label: t.title,
      disabled: !!activeTemplate && activeTemplate.id === t.id,
      command: () => this.setAsActiveTemplate(t.id),
    })),
    {separator: true},
      {
        label: "New Template",
        icon: "mingcute--add-fill",
        command: () => this.createNewTemplate(),
      },

  ]
  });

  addOnsItems: MenuItem[] = [
    { label: "Add-Ons", items: [
      {
        label: "Notes",
        routerLink: "/notes",
        disabled: false,
      },
      {
        label: "TextFiltr",
        routerLink: "/text-filtr",
        disabled: false,
      }
    ]}
  ]

  templateActionItems = computed<MenuItem[]>(() => {
    const activeTemplate = this.activeTemplate();
    return [
      
      {
        label: "Edit",
        icon: "mingcute--edit-2-fill",
        command: () => this.requestEditTemplate(),
      },
      {
        label: "Duplicate",
        icon: "mingcute--copy-2-fill",
        command: () => this.duplicateTemplate(),
      },
      {
        label: "Delete",
        icon: "mingcute--delete-2-fill",
        command: () => this.requestDeleteTemplate()
      },
      
    ];
  });

  activeTemplateTitle = computed(() => {
    const temp = this.activeTemplate();
    if (!temp) return "No Template";

    return temp.title;
  });

  viewTitle = computed(() => {
    const url = this.activeUrl();
    switch (url) {
      case "/":
      case "":
      case "/editor":
        return "Editor";
      case "/text-filtr":
        return "TextFiltr";
      case "/notes":
        return "Notes";
      case "/text-replacr":
        return "TextReplacr";
      case "/settings":
        return "Settings";
      case "/about":
        return "About";
      default:
        return "Notecraftr";
    }
  })

  async ngOnInit() {
    this.appIcon.set(fileSrcToUrl("icons/32x32.png"));
  }

  ngOnDestroy(): void {

  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target;
    const targetIsHTMLElement = target instanceof HTMLElement;
    if (!targetIsHTMLElement) return;
    if ((target as HTMLElement).id === "tauri-drag") {
      startDragging();
    }
  }

  addNote() {
    emitToWindows("notecraftr", "request-note-create", null)
  }

  setAsActiveTemplate(id: number) {
    let templates = this.templates();
    let template = templates.find((t) => t.id === id);
    if (!template) return;
    // this.notecraftrService.setAsActiveTemplate(template, templates);
    // this.notecraftrService.saveTemplates(templates);
    if (this.autoCopyOnTemplateChange() && !this.autoCopyOnOutputChange()) {
      setTimeout(() => this.autoCopyOutputToClipboard(), 100);
    }
  }

  autoCopyOutputToClipboard() {
    writeTextToClipboard(this.output()).then(() => {
      // this.windowService.showMessage.emit({
      //   severity: 'success',
      //   summary: 'Auto Copy',
      //   detail: "Output automatically copied to clipboard.",
      // })
    })
  }

  toggleRestoreApp() {
    if (this.isMaximized()) {
      unmaximizeWindow();
      return;
    }
    maximizeWindow();
  }

  closeApp() {
    closeWindow();
  }

  minimizeApp() {
    minimizeWindow();
  }



  onCloseButtonHover() {
    this.closeButtonHovered.set(true);
  }

  onCloseButtonLeave() {
    this.closeButtonHovered.set(false);
  }

 

  requestDeleteTemplate() {
    let templates = this.templates();
    let template = templates.find((t) => t.active);
    if (!template) return;

    // this.windowService.openConfirmDialog(
    //   this.dialogService,
    //   {
    //     header: "Delete Template",
    //     message: "Are you sure you want to delete this template?",
    //     buttonAppearance: "danger",
    //     yes: "Delete",
    //     no: "Cancel",
    //   },
    //   (v) => {
    //     templates = templates.filter((t) => t.id !== template.id);
    //     if (templates.length === 0) {
    //       this.notecraftrService.addDefaultTemplates(templates)
    //     } else {
    //       const firstId = templates[0].id;
    //       for (let t of templates) {
    //         t.active = t.id === firstId;
    //       }
    //     }
    //     this.notecraftrService.moveActiveTemplateToTop(templates);
    //     this.notecraftrService.saveTemplates(templates);

    //     this.windowService.showMessage.emit({
    //       severity: "error",
    //       summary: "Template Deleted",
    //       detail: `Template "${template.title}" deleted.`,
    //     });
    //   },
    //   () => this.windowService.showMessage.emit({
    //     severity: "secondary",
    //     summary: "Cancelled",
    //     detail: "Template deletion was cancelled",
    //   })
    // );
  }

  duplicateTemplate() {
    let templates = this.templates();
    let template = templates.find((t) => t.active);
    if (!template) return;

    // const newtemp = this.notecraftrService.duplicateTemplate(template, templates);
    // this.notecraftrService.setAsActiveTemplate(newtemp, templates)
    // this.notecraftrService.saveTemplates(templates);
    // this.windowService.showMessage.emit({
    //   severity: "success",
    //   summary: "Template Duplicated",
    //   detail: `Template "${template.title}" duplicated.`,
    // });
  }

  requestEditTemplate() {
    let templates = this.templates();
    let template = templates.find((t) => t.active);
    if (!template) return;

  //   this.windowService.openTemplateEditDialog(this.dialogService, template, (newTemp) => {
  //     this.notecraftrService.saveTemplate(newTemp, templates);
  //     this.windowService.showMessage.emit({
  //       severity: "info",
  //       summary: "Template Updated",
  //       detail: `Template "${newTemp.title}" updated.`,
  //     });
  //   },
  //   () => this.windowService.showMessage.emit({
  //     severity: "secondary",
  //     summary: "Cancelled",
  //     detail: "Template edit was cancelled",
  //   })
  // );
  }

  createNewTemplate() {
    let templates = this.templates();
    // this.notecraftrService.addNewTemplate(templates);
    // this.notecraftrService.saveTemplates(templates);
    // this.windowService.showMessage.emit({
    //   severity: "success",
    //   summary: "Template Added",
    //   detail: "New template added.",
    // });
  }

  updateMouseHovered(value: boolean) {
    this.mouseHovered.set(value);
  }
}
