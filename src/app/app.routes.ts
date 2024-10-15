import { Routes } from '@angular/router';
import { EditorComponent } from './views/editor/editor.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AboutComponent } from './views/about/about.component';
import { TextFiltrComponent } from './views/addons/textfiltr/textfiltr.component';
import { NotesComponent } from './views/addons/notes/notes.component';
import { NotePreviewWindowComponent } from './components/ui/note-preview-window/note-preview-window.component';

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
    {
        path: 'notes',
        component: NotesComponent
    },
    {
        path: 'note-window/:id',
        component: NotePreviewWindowComponent
    },
    {
        path: 'text-filtr',
        component: TextFiltrComponent
    }
];
