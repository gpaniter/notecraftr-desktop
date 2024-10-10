import { EventEmitter, Injectable } from '@angular/core';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CustomMessageService {
  showMessage = new EventEmitter<Message>();
  
}
