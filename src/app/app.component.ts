import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar2Component } from '../../sidebar2/sidebar2';
import { FunctionDataService } from '../../sidebar2/function-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar2Component],
  template: `
    <!-- Top Toolbar -->
    <header class="toolbar">
      <div class="toolbar__brand">
        <svg class="toolbar__logo" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        <span class="toolbar__title">CALGORIC</span>
      </div>
      <nav class="toolbar__nav">
        <button class="toolbar__btn" title="New File">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </button>
        <button class="toolbar__btn" title="Save">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
        </button>
        <button class="toolbar__btn" title="Run">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
      </nav>
      <div class="toolbar__spacer"></div>
      <div class="toolbar__actions">
        <button class="toolbar__btn" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65
                     1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65
                     1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65
                     1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65
                     1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65
                     1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65
                     1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83
                     2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65
                     1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="app-layout">
      <!-- Activity Bar -->
      <aside class="activity-bar">
        <button class="activity-bar__btn activity-bar__btn--active" title="Explorer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </button>
        <button class="activity-bar__btn" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="activity-bar__btn" title="Extensions">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
      </aside>

      <!-- Sidebar -->
      <app-sidebar2 (menuClickSidebar2)="onSidebarClick($event)"></app-sidebar2>

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="main-content__tabs">
          <div class="tab tab--active">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>Welcome</span>
          </div>
        </div>
        <div class="main-content__body">
          <div class="welcome" *ngIf="!selectedItem && !showForm">
            <div class="welcome__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h1 class="welcome__title">Welcome to CALGORIC</h1>
            <p class="welcome__subtitle">Select an item from the sidebar to get started</p>
            <div class="welcome__shortcuts">
              <div class="shortcut"><kbd>Ctrl</kbd>+<kbd>N</kbd> New File</div>
              <div class="shortcut"><kbd>Ctrl</kbd>+<kbd>S</kbd> Save</div>
              <div class="shortcut"><kbd>F5</kbd> Run</div>
            </div>
            <div class="welcome__buttons">
              <button class="add-function-btn" (click)="showForm = true; formMode = 'add'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Function
              </button>
              <button class="add-function-btn add-function-btn--update" (click)="showForm = true; formMode = 'update'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Update Function
              </button>
              <button class="add-function-btn add-function-btn--delete" (click)="showForm = true; formMode = 'delete'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Delete Function
              </button>
            </div>
          </div>

          <!-- Function Form -->
          <div class="function-form" *ngIf="showForm">
            <h2 class="function-form__title">
              {{ formMode === 'add' ? 'Add New Function' : formMode === 'update' ? 'Update Function' : 'Delete Function' }}
            </h2>
            <div class="function-form__group">
              <label class="function-form__label">Function Name</label>
              <input class="function-form__input" type="text" [(ngModel)]="formData.func_name" placeholder="e.g. ABS" />
            </div>
            <div class="function-form__group" *ngIf="formMode !== 'delete'">
              <label class="function-form__label">Description</label>
              <textarea class="function-form__input function-form__textarea" [(ngModel)]="formData.sort_description" placeholder="e.g. Returns the absolute value"></textarea>
            </div>
            <div class="function-form__group" *ngIf="formMode !== 'delete'">
              <label class="function-form__label">Category</label>
              <input class="function-form__input" type="text" [(ngModel)]="formData.main_categori" placeholder="e.g. Math" />
            </div>
            <div class="function-form__group" *ngIf="formMode !== 'delete'">
              <label class="function-form__label">Syntax</label>
              <input class="function-form__input" type="text" [(ngModel)]="formData.syntax" placeholder="e.g. ABS(number)" />
            </div>
            <div class="function-form__group" *ngIf="formMode !== 'delete'">
              <label class="function-form__label">Icon (optional)</label>
              <input class="function-form__input" type="text" [(ngModel)]="formData.icon" placeholder="e.g. calculate" />
            </div>
            <p class="function-form__warning" *ngIf="formMode === 'delete'">This will permanently delete the function. Enter the function name above to confirm.</p>
            <p class="function-form__message" *ngIf="formMessage"
               [ngClass]="{'function-form__message--success': formMessageType === 'success', 'function-form__message--error': formMessageType === 'error'}">
              {{ formMessage }}
            </p>
            <div class="function-form__actions">
              <button class="function-form__btn" 
                      [ngClass]="{'function-form__btn--submit': formMode !== 'delete', 'function-form__btn--delete': formMode === 'delete'}" 
                      (click)="submitForm()">
                {{ formMode === 'add' ? 'Add' : formMode === 'update' ? 'Update' : 'Delete' }}
              </button>
              <button class="function-form__btn function-form__btn--cancel" (click)="cancelForm()">Cancel</button>
            </div>
          </div>
          <div class="selected-view" *ngIf="selectedItem">
            <div class="selected-view__body">
              <p class="fn-detail__value" *ngIf="selectedItem.description">{{ selectedItem.description }}</p>
              <p class="fn-detail__value" *ngIf="!selectedItem.description">{{ selectedItem.section }} / {{ selectedItem.label }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Status Bar -->
    <footer class="status-bar">
      <div class="status-bar__left">
        <span class="status-bar__item">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Ready
        </span>
      </div>
      <div class="status-bar__right">
        <span class="status-bar__item">CALGORIC v1.0</span>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ===== TOOLBAR ===== */
    .toolbar {
      display: flex;
      align-items: center;
      height: 40px;
      background: #1e1e1e;
      color: #cccccc;
      padding: 0 12px;
      gap: 8px;
      flex-shrink: 0;
      -webkit-app-region: drag;
      z-index: 50;
    }
    .toolbar__brand {
      display: flex;
      align-items: center;
      gap: 8px;
      -webkit-app-region: no-drag;
    }
    .toolbar__logo { color: #569cd6; }
    .toolbar__title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: #e0e0e0;
    }
    .toolbar__nav {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-left: 16px;
      -webkit-app-region: no-drag;
    }
    .toolbar__spacer { flex: 1; }
    .toolbar__actions {
      display: flex;
      align-items: center;
      gap: 2px;
      -webkit-app-region: no-drag;
    }
    .toolbar__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 28px;
      border: none;
      background: transparent;
      color: #999;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .toolbar__btn:hover {
      background: #333;
      color: #fff;
    }

    /* ===== APP LAYOUT ===== */
    .app-layout {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    /* ===== ACTIVITY BAR ===== */
    .activity-bar {
      display: flex;
      flex-direction: column;
      width: 48px;
      background: #252526;
      align-items: center;
      padding-top: 8px;
      gap: 4px;
      flex-shrink: 0;
    }
    .activity-bar__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      color: #888;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      transition: color 0.15s, background 0.15s;
    }
    .activity-bar__btn:hover {
      color: #e0e0e0;
    }
    .activity-bar__btn--active {
      color: #ffffff;
    }
    .activity-bar__btn--active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: #569cd6;
      border-radius: 0 2px 2px 0;
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: #1e1e1e;
    }
    .main-content__tabs {
      display: flex;
      height: 36px;
      background: #252526;
      border-bottom: 1px solid #1e1e1e;
      flex-shrink: 0;
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 16px;
      font-size: 12px;
      color: #888;
      border-right: 1px solid #1e1e1e;
      cursor: pointer;
      transition: background 0.1s;
    }
    .tab--active {
      background: #1e1e1e;
      color: #e0e0e0;
      border-top: 2px solid #569cd6;
    }
    .main-content__body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      padding: 24px;
    }

    /* ===== WELCOME ===== */
    .welcome {
      text-align: center;
      color: #666;
    }
    .welcome__icon {
      color: #444;
      margin-bottom: 20px;
    }
    .welcome__title {
      font-size: 26px;
      font-weight: 300;
      color: #ccc;
      margin-bottom: 8px;
    }
    .welcome__subtitle {
      font-size: 14px;
      color: #777;
      margin-bottom: 32px;
    }
    .welcome__shortcuts {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    .shortcut {
      font-size: 12px;
      color: #777;
    }
    kbd {
      display: inline-block;
      padding: 2px 6px;
      font-size: 11px;
      font-family: 'SFMono-Regular', Consolas, monospace;
      color: #ccc;
      background: #333;
      border: 1px solid #555;
      border-radius: 3px;
      margin: 0 2px;
    }

    /* ===== SELECTED VIEW ===== */
    .selected-view {
      width: 100%;
      max-width: 800px;
    }
    .selected-view__body .fn-detail__value {
      font-size: 22px;
      font-weight: 300;
      color: #d4d4d4;
      line-height: 1.6;
      margin: 0;
      padding: 32px 40px;
      background: transparent;
      border: none;
      border-radius: 0;
      letter-spacing: 0.01em;
    }
    .code-placeholder {
      background: #252526;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 20px;
    }
    .code-placeholder code {
      font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace;
      font-size: 13px;
      color: #6a9955;
    }
    .selected-view__description {
      font-size: 14px;
      color: #9cdcfe;
      background: #252526;
      border-left: 3px solid #569cd6;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 8px 0 16px 0;
    }
    .selected-view__badge {
      font-size: 11px;
      font-weight: 500;
      color: #dcdcaa;
      background: #333;
      padding: 2px 10px;
      border-radius: 12px;
      margin-left: 12px;
      letter-spacing: 0.03em;
    }

    /* Function detail cards */
    .fn-detail {
      background: #252526;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .fn-detail:hover {
      border-color: #569cd6;
    }
    .fn-detail__row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    .fn-detail__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #094771;
      color: #569cd6;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .fn-detail__icon--syntax {
      background: #2d2d0d;
      color: #dcdcaa;
    }
    .fn-detail__label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }
    .fn-detail__value {
      font-size: 14px;
      color: #cccccc;
      line-height: 1.6;
      margin: 0;
    }
    .fn-detail__syntax {
      display: inline-block;
      font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace;
      font-size: 14px;
      color: #dcdcaa;
      background: #1e1e1e;
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid #3c3c3c;
    }

    /* ===== ADD FUNCTION BUTTON ===== */
    .welcome__buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .add-function-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      background: #0e639c;
      border: 1px solid #1177bb;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .add-function-btn:hover {
      background: #1177bb;
    }
    .add-function-btn--update {
      background: #c27d2f;
      border-color: #d48f3e;
    }
    .add-function-btn--update:hover {
      background: #d48f3e;
    }
    .add-function-btn--delete {
      background: #a1260d;
      border-color: #c42b1c;
    }
    .add-function-btn--delete:hover {
      background: #c42b1c;
    }

    /* ===== FUNCTION FORM ===== */
    .function-form {
      width: 100%;
      max-width: 520px;
      padding: 32px;
      background: #252526;
      border: 1px solid #3c3c3c;
      border-radius: 8px;
    }
    .function-form__title {
      font-size: 20px;
      font-weight: 400;
      color: #e0e0e0;
      margin: 0 0 24px 0;
    }
    .function-form__group {
      margin-bottom: 16px;
    }
    .function-form__label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }
    .function-form__input {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      font-family: inherit;
      color: #d4d4d4;
      background: #1e1e1e;
      border: 1px solid #3c3c3c;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .function-form__input:focus {
      border-color: #569cd6;
    }
    .function-form__input::placeholder {
      color: #555;
    }
    .function-form__textarea {
      resize: vertical;
      min-height: 80px;
    }
    .function-form__actions {
      display: flex;
      gap: 10px;
      margin-top: 24px;
    }
    .function-form__btn {
      padding: 8px 24px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .function-form__btn--submit {
      color: #fff;
      background: #0e639c;
    }
    .function-form__btn--submit:hover {
      background: #1177bb;
    }
    .function-form__btn--delete {
      color: #fff;
      background: #a1260d;
    }
    .function-form__btn--delete:hover {
      background: #c42b1c;
    }
    .function-form__warning {
      font-size: 13px;
      color: #f48771;
      margin: 8px 0 0 0;
    }
    .function-form__message {
      font-size: 13px;
      margin: 12px 0 0 0;
      padding: 8px 12px;
      border-radius: 4px;
    }
    .function-form__message--success {
      color: #89d185;
      background: #1e3a1e;
      border: 1px solid #2d5a2d;
    }
    .function-form__message--error {
      color: #f48771;
      background: #3a1e1e;
      border: 1px solid #5a2d2d;
    }
    .function-form__btn--cancel {
      color: #ccc;
      background: #3c3c3c;
    }
    .function-form__btn--cancel:hover {
      background: #4a4a4a;
    }

    /* ===== STATUS BAR ===== */
    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 22px;
      background: #007acc;
      color: #fff;
      padding: 0 10px;
      font-size: 11px;
      flex-shrink: 0;
    }
    .status-bar__left,
    .status-bar__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-bar__item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class AppComponent {
  selectedItem: { section: string; label: string; description?: string; syntax?: string; category?: string } | null = null;
  showForm = false;
  formMode: 'add' | 'update' | 'delete' = 'add';
  formMessage = '';
  formMessageType: 'success' | 'error' = 'success';
  formData = {
    func_name: '',
    sort_description: '',
    main_categori: '',
    syntax: '',
    icon: ''
  };

  constructor(private functionDataService: FunctionDataService) {}

  onSidebarClick(item: { section: string; label: string; description?: string; syntax?: string; category?: string }) {
    this.selectedItem = item;
    this.showForm = false;
    this.formMessage = '';
  }

  submitForm() {
    this.formMessage = '';
    if (!this.formData.func_name.trim()) {
      this.formMessage = 'Function name is required.';
      this.formMessageType = 'error';
      return;
    }

    if (this.formMode === 'add') {
      const success = this.functionDataService.addFunction({
        func_name: this.formData.func_name.trim(),
        sort_description: this.formData.sort_description.trim(),
        main_categori: this.formData.main_categori.trim(),
        syntax: this.formData.syntax.trim(),
        icon: this.formData.icon.trim() || undefined
      });
      if (success) {
        this.formMessage = `"${this.formData.func_name}" added successfully.`;
        this.formMessageType = 'success';
        this.resetFormData();
      } else {
        this.formMessage = `A function named "${this.formData.func_name}" already exists.`;
        this.formMessageType = 'error';
      }
    } else if (this.formMode === 'update') {
      const success = this.functionDataService.updateFunction({
        func_name: this.formData.func_name.trim(),
        sort_description: this.formData.sort_description.trim(),
        main_categori: this.formData.main_categori.trim(),
        syntax: this.formData.syntax.trim(),
        icon: this.formData.icon.trim() || undefined
      });
      if (success) {
        this.formMessage = `"${this.formData.func_name}" updated successfully.`;
        this.formMessageType = 'success';
        this.resetFormData();
      } else {
        this.formMessage = `Function "${this.formData.func_name}" not found.`;
        this.formMessageType = 'error';
      }
    } else if (this.formMode === 'delete') {
      const success = this.functionDataService.deleteFunction(this.formData.func_name.trim());
      if (success) {
        this.formMessage = `"${this.formData.func_name}" deleted successfully.`;
        this.formMessageType = 'success';
        this.resetFormData();
      } else {
        this.formMessage = `Function "${this.formData.func_name}" not found.`;
        this.formMessageType = 'error';
      }
    }
  }

  cancelForm() {
    this.showForm = false;
    this.formMessage = '';
    this.resetFormData();
  }

  private resetFormData() {
    this.formData = { func_name: '', sort_description: '', main_categori: '', syntax: '', icon: '' };
  }
}
