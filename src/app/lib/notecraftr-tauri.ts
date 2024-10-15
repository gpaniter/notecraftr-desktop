import { emitTo, EventCallback } from "@tauri-apps/api/event";
import {
  CloseRequestedEvent,
  getCurrentWindow,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import { open } from "@tauri-apps/plugin-shell";
import { convertFileSrc } from "@tauri-apps/api/core";
import { resolve } from "@tauri-apps/api/path";
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";

export function onResized(handler: EventCallback<PhysicalSize>) {
  return getCurrentWindow().onResized(handler);
}

export function onMoved(handler: EventCallback<PhysicalPosition>) {
  return getCurrentWindow().onMoved(handler);
}

export function onFocusChanged(handler: EventCallback<boolean>){
  return getCurrentWindow().onFocusChanged(handler);
}

export function emitToWindows(target: string, event: string, payload?: unknown){
  return emitTo(target, event, payload)
}

export function isMaximized() {
  return getCurrentWindow().isMaximized();
}

export function maximizeWindow() {
  return getCurrentWindow().maximize();
}

export function unmaximizeWindow() {
  return getCurrentWindow().unmaximize();
}

export function minimizeWindow() {
  return getCurrentWindow().minimize();
}

export function closeWindow() {
  return getCurrentWindow().close();
}

export function startDragging() {
  return getCurrentWindow().startDragging();
}

export function getWindowSize() {
  return getCurrentWindow().innerSize();
}

export function getWindowPosition() {
  return getCurrentWindow().innerPosition();
}

export function getWindowFocused() {
  return getCurrentWindow().isFocused();
}


export function onCloseWindowRequest(
  handler: (event: CloseRequestedEvent) => void | Promise<void>
) {
  return getCurrentWindow().onCloseRequested(handler);
}

export function writeTextToClipboard(text: string) {
  return writeText(text);
}

export function readTextFromClipboard() {
  return readText();
}

export function openUrl(url: string) {
  return open(url);
}

export function resolvePath(...paths: string[]) {
  return resolve(...paths);
}

export function fileSrcToUrl(path: string, protocol?: string) {
  return convertFileSrc(path, protocol);
}

export function setAutostart(enabled: boolean) {
  if (enabled) {
    return enable();
  } else {
    return disable();
  }
}

export async function isAutostartEnabled() {
  return isEnabled();
}

export function getAllNoteCraftrWindows() {
  return getAllWebviewWindows()
}

export function onWindowClosed(){
  
}
