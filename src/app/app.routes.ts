import { Routes } from '@angular/router';
import { EditorComponent } from './views/editor/editor.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AboutComponent } from './views/about/about.component';

export const routes: Routes = [
    {
        path: '',
        component: EditorComponent
    },
    {
        path: 'editor',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    // {
    //     path: 'notes',
    //     component: NotesComponent
    // },
    // {
    //     path: 'note-window/:id',
    //     component: NotePreviewWindowComponent
    // },
    // {
    //     path: 'text-replacr',
    //     component: TextreplacrComponent
    // },
    // {
    //     path: 'text-filtr',
    //     component: TextfiltrComponent
    // }
];
