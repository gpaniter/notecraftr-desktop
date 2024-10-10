import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { TooltipModule } from "primeng/tooltip";
import { NgClass } from "@angular/common";

import { Template } from "../../../types/notecraftr";
import {
  closeWindow,
  emitToWindows,
  fileSrcToUrl,
  maximizeWindow,
  minimizeWindow,
  startDragging,
  unmaximizeWindow,
  writeTextToClipboard,
} from "../../../lib/notecraftr-tauri";
import { RippleModule } from "primeng/ripple";
import { Store, StoreModule } from "@ngrx/store";
import { editorInitialState, editorReducer } from "../../../state/editor/editor.reducer";
import {
  selectActiveTemplate,
  selectAllTemplates,
} from "../../../state/editor/editor.selectors";
import { getUniqueId } from "../../../utils/helpers";
import * as editorActions from "../../../state/editor/editor.actions";
import { EffectsFeatureModule, EffectsModule } from "@ngrx/effects";
import { EditorEffects } from "../../../state/editor/editor.effects";
import { selectMaximized } from "../../../state/window/window.selectors";
import { maximize, unmaximize } from "../../../state/window/window.actions";
import { CustomMessageService } from "../../../services/custom-message.service";
import { CustomDialogService } from "../../../services/custom-dialog.service";

@Component({
  selector: "nc-menubar",
  standalone: true,
  imports: [RippleModule, MenuModule, ButtonModule, TooltipModule, NgClass],
  templateUrl: "./menubar.component.html",
  styleUrl: "./menubar.component.scss",
  providers: [DialogService],
})
export class MenubarComponent {
  store = inject(Store);
  customMessage = inject(CustomMessageService);
  customDialog = inject(CustomDialogService);
  output = signal("");
  autoCopyOnTemplateChange = signal(false);
  autoCopyOnOutputChange = signal(false);
  addonsEnabled = signal(false);
  activeUrl = signal("");
  maximized = this.store.selectSignal(selectMaximized);
  templates = this.store.selectSignal(selectAllTemplates);
  activeTemplate = this.store.selectSignal(selectActiveTemplate);
  appIcon = signal("");
  mouseHovered = signal(false);
  closeButtonHovered = signal(false);
  notePreviewWindowMode = computed(() => {
    const url = this.activeUrl();
    return /note-window/g.test(url);
  });
  editorMode = computed(() => {
    const url = this.activeUrl();
    return ["", "/", "/editor"].includes(url);
  });
  windowBlured = signal(false);

  templateMenuItems = computed<MenuItem[]>(() => {
    const templates = this.templates();
    const activeTemplate = this.activeTemplate();
    const activeFirst = activeTemplate ? [activeTemplate] : [];
    const filteredTemplates = activeFirst.concat(
      templates.filter((t) => activeTemplate? (activeTemplate.id !== t.id) : true)
    );
    const templateOptions: MenuItem[] = filteredTemplates
    // .filter((t) => activeTemplate && activeTemplate.id !== t.id)
    .map((t) => ({
      label: t.title,
      disabled: !!activeTemplate && activeTemplate.id === t.id,
      command: () => this.setAsActiveTemplate(t.id),
    }))

    if (templateOptions.length > 0) {
      templateOptions.push({ separator: true })
    }
    templateOptions.push({
      label: "New Template",
        icon: "mingcute--add-fill",
        command: () => this.createNewTemplate(),
    })
    return templateOptions;
  });

  addOnsItems: MenuItem[] = [
    {
      label: "Add-Ons",
      items: [
        {
          label: "Notes",
          routerLink: "/notes",
          disabled: false,
        },
        {
          label: "TextFiltr",
          routerLink: "/text-filtr",
          disabled: false,
        },
      ],
    },
  ];

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
        command: () => this.requestDeleteTemplate(),
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
  });
  

  async ngOnInit() {
    this.appIcon.set(fileSrcToUrl("icons/32x32.png"));
  }

  ngOnDestroy(): void {}

  @HostListener("mousedown", ["$event"])
  onMouseDown(event: MouseEvent) {
    const target = event.target;
    const targetIsHTMLElement = target instanceof HTMLElement;
    const isDoubleClick = event.detail === 2;
    if (!targetIsHTMLElement) return;
    if ((target as HTMLElement).id === "tauri-drag" && !isDoubleClick) {
      startDragging();
    } else if (isDoubleClick) {
      this.toggleRestoreApp();
      console.log(1)
    }

  }
  
  @HostListener("document:contextmenu", ["$event"])
  debugg(event: MouseEvent) {
    event.preventDefault();
    console.log(this.templates())

  }

  addNote() {
    emitToWindows("notecraftr", "request-note-create", null);
  }

  setAsActiveTemplate(id: number) {
    let templates = this.templates();
    let template = templates.find((t) => t.id === id);
    if (!template) return;
    this.store.dispatch(editorActions.setActiveTemplate({ template }));
    // this.notecraftrService.setAsActiveTemplate(template, templates);
    // this.notecraftrService.saveTemplates(templates);
    if (this.autoCopyOnTemplateChange() && !this.autoCopyOnOutputChange()) {
      setTimeout(() => this.autoCopyOutputToClipboard(), 100);
    }
  }

  autoCopyOutputToClipboard() {
    writeTextToClipboard(this.output()).then(() => {
      this.customMessage.showMessage.emit({
        severity: 'success',
        summary: 'Auto Copy',
        detail: "Output automatically copied to clipboard.",
      })
    });
  }

  toggleRestoreApp() {
    if (this.maximized()) {
      unmaximizeWindow()
      return;
    }
    maximizeWindow()
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
    this.store.dispatch(editorActions.deleteTemplate({ template }));

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
    let template = this.activeTemplate();
    if (!template) return;

    const newTemp = {
      ...template,
      id: getUniqueId(templates.map((t) => t.id)),
    };
    this.store.dispatch(editorActions.duplicateTemplate({template}));
    // this.store.dispatch(editorActions.setActiveTemplate({ template: newTemp }));

    this.customMessage.showMessage.emit({
      severity: "success",
      summary: "Template Duplicated",
      detail: `Template "${template.title}" duplicated.`,
    });
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
    const newTemp: Template = {
      id: getUniqueId(templates.map((t) => t.id)),
      title: "New Template " + templates.length,
      sections: [],
      active: false,
    };
    this.store.dispatch(editorActions.addTemplate({ template: newTemp }));
    this.store.dispatch(editorActions.setActiveTemplate({ template: newTemp }));

    this.customMessage.showMessage.emit({
      severity: "success",
      summary: "Template Added",
      detail: "New template added.",
    });
  }

  updateMouseHovered(value: boolean) {
    this.mouseHovered.set(value);
  }
}
