// [OLD] Original imports
import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EngineService } from './engine.service';
import { FunctionDataService } from './function-data.service';

// FunctionNode describes a function's metadata
export interface FunctionNode {
  func_name: string;
  sort_description: string;
  main_categori: string;
  syntax: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar2.html',
  styleUrls: ['./sidebar2.css']
})
export class Sidebar2Component implements OnInit, OnDestroy {
  // Static cache for fast lookups
  private static functionNodes: FunctionNode[] = [];
  private static nameIndex: Map<string, FunctionNode> | null = null;
  private static categoryIndex: Map<string, FunctionNode[]> | null = null;

  // Build lookup maps if needed
  private static buildIndexes(): void {
    if (Sidebar2Component.nameIndex) return;
    Sidebar2Component.nameIndex = new Map();
    Sidebar2Component.categoryIndex = new Map();
    for (const node of Sidebar2Component.functionNodes) {
      const nameKey = node.func_name.toLowerCase();
      const catKey = node.main_categori.toLowerCase();
      Sidebar2Component.nameIndex.set(nameKey, node);
      const bucket = Sidebar2Component.categoryIndex.get(catKey);
      bucket ? bucket.push(node) : Sidebar2Component.categoryIndex.set(catKey, [node]);
    }
  }

  // Reset and rebuild indexes
  private static rebuildIndexes(): void {
    Sidebar2Component.nameIndex = null;
    Sidebar2Component.categoryIndex = null;
    Sidebar2Component.buildIndexes();
  }

  // Load new function data
  static loadFunctions(data: FunctionNode[]): void {
    Sidebar2Component.functionNodes = data;
    Sidebar2Component.rebuildIndexes();
  }

  // Find a function by name
  static findByName(name: string): FunctionNode | null {
    const key = name?.trim().toLowerCase();
    if (!key) return null;
    Sidebar2Component.buildIndexes();
    return Sidebar2Component.nameIndex!.get(key) ?? null;
  }

  // Find all functions in a category
  static findByCategory(category: string): FunctionNode[] {
    const key = category?.trim().toLowerCase();
    if (!key) return [];
    Sidebar2Component.buildIndexes();
    return Sidebar2Component.categoryIndex!.get(key) ?? [];
  }

  // Emits details to parent
  @Output() menuClickSidebar2 = new EventEmitter<{
    section: string; label: string; description?: string; syntax?: string; category?: string;
  }>();

  // Sidebar state
  selectedItem: { section: string; label: string } | null = null;
  minWidth: number = 0;
  maxWidth: number = 0;
  isOpen: boolean = true;
  isResizing: boolean = false;
  currentWidth: number = 0;
  isHeadingMenuOpen: boolean = false;
  isLocked: boolean = false;
  selectedDescription = '';
  isLoading = true;
  private startX: number = 0;
  private startWidth: number = 0;
  private subscriptions: Subscription[] = [];
  functionCategories: { name: string; icon: string; items: FunctionNode[] }[] = [];
  openSections: any = {
    projects: false,
    functions: { main: false },
    userFunction: false,
    object: false
  };

  constructor(
    private engineService: EngineService,
    private functionDataService: FunctionDataService
  ) {}

  // Setup subscriptions and load data
  ngOnInit(): void {
    this.minWidth = 0;
    this.maxWidth = window.innerWidth * 0.30;
    this.currentWidth = window.innerWidth * 0.10;
    this.subscriptions.push(
      this.engineService.isEngineBusy$.subscribe((status: boolean) => this.isLocked = status)
    );
    this.subscriptions.push(
      this.functionDataService.getFunctions().subscribe({
        next: (nodes: FunctionNode[]) => {
          Sidebar2Component.loadFunctions(nodes);
          this.buildDynamicSections(nodes);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load functions:', err);
          this.isLoading = false;
        }
      })
    );
  }

  // Cleanup subscriptions
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // Group functions by category for sidebar
  private buildDynamicSections(nodes: FunctionNode[]): void {
    const categoryMap = new Map<string, FunctionNode[]>();
    for (const node of nodes) {
      const bucket = categoryMap.get(node.main_categori);
      bucket ? bucket.push(node) : categoryMap.set(node.main_categori, [node]);
    }
    this.functionCategories = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name, icon: this.functionDataService.getCategoryIcon(name), items
    }));
    this.openSections.functions = { main: true };
    for (const cat of this.functionCategories) {
      this.openSections.functions[cat.name] = true;
    }
  }

  // Handle item click
  selectItem(section: string, label: string, event: MouseEvent): void {
    if (this.isLocked) {
      alert("Please wait. CALGORIC is processing a heavy workflow.");
      return;
    }
    event.stopPropagation();
    this.selectedItem = { section, label };
    if (section === 'functions') {
      const fn = Sidebar2Component.findByName(label);
      if (fn) {
        this.selectedDescription = fn.sort_description;
        this.menuClickSidebar2.emit({ section, label, description: fn.sort_description, syntax: fn.syntax, category: fn.main_categori });
      } else {
        const catFns = Sidebar2Component.findByCategory(label);
        this.selectedDescription = catFns.length > 0 ? catFns.map(f => f.func_name).join(', ') : label;
        this.menuClickSidebar2.emit({ section, label, description: this.selectedDescription });
      }
    } else {
      this.selectedDescription = '';
      this.menuClickSidebar2.emit({ section, label });
    }
  }

  // Highlight selected item
  isItemSelected(section: string, label: string): boolean {
    return this.selectedItem?.section === section && this.selectedItem?.label === label;
  }

  // For *ngFor performance
  trackByCategory(_i: number, cat: { name: string }): string { return cat.name; }
  trackByItem(_i: number, item: FunctionNode): string { return item.func_name; }

  // Toggle sidebar sections
  toggleSection(section: string): void {
    if (section === 'functions') {
      this.openSections.functions.main = !this.openSections.functions.main;
    } else if (section.startsWith('functions-')) {
      const sub = section.substring(10);
      this.openSections.functions[sub] = !this.openSections.functions[sub];
    } else {
      this.openSections[section] = !this.openSections[section];
    }
  }

  // Toggle sidebar open/close
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.currentWidth = window.innerWidth * 0.10;
    } else {
      this.currentWidth = 0;
    }
  }

  // Toggle heading menu
  toggleHeadingMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isHeadingMenuOpen = !this.isHeadingMenuOpen;
  }

  // Collapse all sections
  closeAll(): void {
    this.openSections.projects = false;
    this.openSections.functions.main = false;
    Object.keys(this.openSections.functions).forEach(k => { if (k !== 'main') this.openSections.functions[k] = false; });
    this.openSections.userFunction = false;
    this.openSections.object = false;
    this.isHeadingMenuOpen = false;
  }

  // Expand all sections
  openAll(): void {
    this.openSections.projects = true;
    this.openSections.functions.main = true;
    Object.keys(this.openSections.functions).forEach(k => { if (k !== 'main') this.openSections.functions[k] = true; });
    this.openSections.userFunction = true;
    this.openSections.object = true;
    this.isHeadingMenuOpen = false;
  }

  // Aliases for template
  collapseAll(): void { this.closeAll(); }
  expandAll(): void { this.openAll(); }

  // Close sidebar
  closeSidebar(): void {
    this.isOpen = false;
    this.currentWidth = 0;
    this.isHeadingMenuOpen = false;
  }

  // Start resize drag
  startResize(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.currentWidth;
    event.preventDefault();
  }

  // Handle mouse move for resize
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing) return;
    const delta = event.clientX - this.startX;
    let newWidth = this.startWidth + delta;
    this.minWidth = 0;
    this.maxWidth = window.innerWidth * 0.30;
    newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
    this.currentWidth = newWidth;
    this.isOpen = this.currentWidth > 0;
  }

  // Stop resizing
  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isResizing = false;
  }

  // Close heading menu on outside click
  @HostListener('document:click')
  onDocumentClick(): void {
    this.isHeadingMenuOpen = false;
  }

  // Sidebar width for template binding
  get sidebarWidth(): string {
    return `${this.currentWidth}px`;
  }
}