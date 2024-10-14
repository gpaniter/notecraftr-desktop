import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Location, NgClass } from '@angular/common';
import { getVersion } from '@tauri-apps/api/app';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { Store } from '@ngrx/store';
import { fileSrcToUrl, openUrl } from '../../lib/notecraftr-tauri';
import * as WindowState from '../../state/window';

@Component({
  selector: 'nc-about',
  standalone: true,
  imports: [ButtonModule, TooltipModule, NgClass, AvatarModule, DividerModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  store = inject(Store);
  theme = this.store.selectSignal(WindowState.theme);
  locationService = inject(Location);
  currentYear = new Date().getFullYear();
  version = signal("");
  appIcon = signal("");
  developerImg = signal("");

  ngOnInit() {
    getVersion().then(v => this.version.set(v));
    this.appIcon.set(fileSrcToUrl("icons/Square44x44Logo.png"));
    this.developerImg.set(fileSrcToUrl("icons/gen.paniterce.png"));
  }

  onBackClick() {
    this.locationService.back()
  }

  openGitHub = () => {
    openUrl("https://github.com/gpaniter/")
  }

  openYoutube = () => {
    openUrl("https://www.youtube.com/@gen.paniterce/")
  }

  openMicrosoftStore = () => {
    return;
    openUrl("https://www.youtube.com/@gen.paniterce/")
  }
  
  openChromeWebStore = () => {
    return;
    openUrl("https://www.youtube.com/@gen.paniterce/")
  }

}
