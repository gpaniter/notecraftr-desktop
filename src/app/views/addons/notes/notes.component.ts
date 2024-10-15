import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { WindowService } from '../../../services/window.service';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { NoteItemComponent } from '../../ui/note-item/note-item.component';
import { Note } from '../../../../types/notecraftr';
import { NotesService } from '../../../services/notes.service';
import { Location } from '@angular/common';

@Component({
  selector: 'nc-notes',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    NoteItemComponent
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {
  databaseService = inject(DatabaseService);
  noteService = inject(NotesService);
  windowService = inject(WindowService);
  locationService = inject(Location);
  theme = this.databaseService.theme;
  notes = this.databaseService.notes;
  

  addNewNote() {
    let notes = this.notes();
    this.noteService.addNewNote(notes);
    this.noteService.saveNotes(notes);
    this.windowService.showMessage.emit({
      severity: "success",
      summary: "New Note",
      detail: `A new Note was created.`,
    });
  }

  noteDrop(event: CdkDragDrop<Note[]>){
    let notes = this.notes();
    moveItemInArray(notes, event.previousIndex, event.currentIndex);
    this.noteService.saveNotes(notes);
  }

  onBackClick() {
    this.locationService.back();
  }

  deleteNote(note: Note) {
    const notes = this.notes();

    // CUSTOM FUNCTION FOR DELETING NOTE
    // BUG WHEN USING DELETE, then SAVE
    this.noteService.deleteNoteAndSave(note, notes);
  }
  
}
