//Sometimes a heavy calculation is running. You don't want the user clicking things while it's busy.
//This runs once when you open the app in the browser.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
// a variable that holds true or false
export class EngineService {   
  private isEngineBusySubject = new BehaviorSubject<boolean>(false);
  isEngineBusy$ = this.isEngineBusySubject.asObservable();
 // other parts of the app listen to this to know the current status
  setEngineBusy(status: boolean): void {
    this.isEngineBusySubject.next(status);
  }
} 
