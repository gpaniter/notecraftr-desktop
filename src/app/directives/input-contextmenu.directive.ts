import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import {
  IconMenuItem,
  Menu,
  PredefinedMenuItem,
} from "@tauri-apps/api/menu";
import { debounceTime, fromEvent, map, startWith, Subscription } from 'rxjs';
import { readTextFromClipboard, writeTextToClipboard } from '../lib/notecraftr-tauri';

@Directive({
  selector: '[ncInputContextmenu]',
  standalone: true
})
export class InputContextmenuDirective {

  host = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  menu: Menu | undefined = undefined;
  value: string = "";
  valueChange$: Subscription | undefined;

  ngAfterViewInit(): void {
    // const asd = this.host.nativeElement.on
    this.createMenu();
    this.valueChange$ = fromEvent(this.host.nativeElement, "input")
    .pipe(
      debounceTime(200),
      map((e) => (e.target as HTMLInputElement | HTMLTextAreaElement).value),
      startWith(this.host.nativeElement.value)
    )
    .subscribe((v) => {
      // console.log(v)
      this.value = v;
    });
  }

  ngOnDestroy(): void {
    this.valueChange$?.unsubscribe();
    this.menu?.close();
  }

  @HostListener("contextmenu", ["$event"])
  async onContext(e: MouseEvent) {
    this.toggleMenu(e);
  }

  async createMenu() {
    const separator = PredefinedMenuItem.new({ item: "Separator" });
    const hasSelection = !!this.getHighlightedText();
    const items = await Promise.all([
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_Undo_18_N.png'),
        text: "Undo",
        action: (e) => this.undo(),
        enabled: this.hasUndo(),
        accelerator: "Ctrl+Z",
      }),
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_Redo_18_N.png'),
        text: "Redo",
        action: (e) => this.redo(),
        enabled: this.hasRedo(),
        accelerator: "Ctrl+Shift+Z",
      }),
      separator,
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_Cut_18_N.png'),
        text: "Cut",
        action: (e) => this.cut(),
        enabled: hasSelection,
        accelerator: "Ctrl+X",
      }),
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_Copy_18_N.png'),
        text: "Copy",
        action: (e) => this.copy(),
        enabled: hasSelection,
        accelerator: "Ctrl+C",
      }),
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_PasteText_18_N.png'),
        text: "Paste",
        action: (e) => this.paste(),
        enabled: true,
        accelerator: "Ctrl+V",
      }),
      IconMenuItem.new({
        // icon: await resolve('icons/spectrum/dark/Smock_Delete_18_N.png'),
        text: "Delete",
        action: (e) => this.clear(),
        enabled: hasSelection,
        accelerator: "Delete",
      }),
      separator,
      IconMenuItem.new({
        text: "Select All",
        action: (e) => this.selectAll(),
        enabled: !!this.value,
        accelerator: "Ctrl+A",
      }),
    ]);

    this.menu = await Menu.new({ items });
  }

  async updateMenu() {
    if (!this.menu) {
      await this.createMenu();
      return;
    }
    const items = await this.menu.items();
    const hasSelection = !!this.getHighlightedText();
    for (let i of items) {
      if (i.kind == "Icon") {
        const item = i as IconMenuItem;
        switch (await item.text()) {
          case "Undo":
            item.setEnabled(this.hasUndo());
            break;
          case "Redo":
            item.setEnabled(this.hasRedo());
            break;
          case "Cut":
            item.setEnabled(hasSelection);
            break;
          case "Copy":
            item.setEnabled(hasSelection);
            break;
          case "Delete":
            item.setEnabled(hasSelection);
            break;
          case "Select All":
            item.setEnabled(!!this.value);
            break;
        }
      }
    }
  }

  async toggleMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.menu) {
      return;
    }
    await this.updateMenu().then(() => this.menu?.popup())
  }

  selectAll() {
    this.host.nativeElement.select();
  }

  hasUndo() {
    return document.queryCommandEnabled("undo");
  }

  hasRedo() {
    return document.queryCommandEnabled("redo");
  }

  undo() {
    this.host.nativeElement.focus();
    document.execCommand("undo", false);
  }

  redo() {
    this.host.nativeElement.focus();
    document.execCommand("redo", false);
  }

  cut() {
    if (!this.getHighlightedText().length) {
      this.selectAll();
    }
    this.copy();
    this.clear();
  }

  copy() {
    this.copySelectedToClipboard();
  }

  paste() {
    this.pasteSelectedFromClipboard();
  }

  clear() {
    this.clearSelected();
  }

  clearSelected() {
    this.host.nativeElement.focus();
    document.execCommand("delete", false);
  }

  async copySelectedToClipboard() {
    await writeTextToClipboard(this.getHighlightedText())
      .then(() => this.host.nativeElement.focus());
  }

  async copyAllToClipboard() {
    await writeTextToClipboard(this.host.nativeElement.value.toString() || "")
      .finally(() => this.host.nativeElement.focus());
  }

  async pasteSelectedFromClipboard() {
    await readTextFromClipboard().then((v) => {
      this.insertText(v);
    });
  }

  insertText(value: string) {
    this.host.nativeElement.focus();
    document.execCommand("insertText", false, value);
  }

  clearAll() {
    this.host.nativeElement.select();
    document.execCommand("delete", false);
  }

  getHighlightedText() {
    const elem = this.host.nativeElement;
    return elem.value.substring(
      elem.selectionStart || 0,
      elem.selectionEnd || 0
    );
  }

}
