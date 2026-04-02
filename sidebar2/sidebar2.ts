import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EngineService } from './engine.service';
import { FunctionDataService } from './function-data.service';

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

  // --- Static function search indexes ---
  private static functionNodes: FunctionNode[] = [];
  private static nameIndex: Map<string, FunctionNode> | null = null;
  private static categoryIndex: Map<string, FunctionNode[]> | null = null;

  private static buildIndexes(): void {
    if (Sidebar2Component.nameIndex) return;
    Sidebar2Component.nameIndex = new Map<string, FunctionNode>();
    Sidebar2Component.categoryIndex = new Map<string, FunctionNode[]>();
    for (let i = 0, len = Sidebar2Component.functionNodes.length; i < len; i++) {
      const node = Sidebar2Component.functionNodes[i];
      const nameKey = node.func_name.toLowerCase();
      const catKey = node.main_categori.toLowerCase();
      Sidebar2Component.nameIndex.set(nameKey, node);
      const bucket = Sidebar2Component.categoryIndex.get(catKey);
      if (bucket) {
        bucket.push(node);
      } else {
        Sidebar2Component.categoryIndex.set(catKey, [node]);
      }
    }
  }

  private static rebuildIndexes(): void {
    Sidebar2Component.nameIndex = null;
    Sidebar2Component.categoryIndex = null;
    Sidebar2Component.buildIndexes();
  }

  static loadFunctions(data: FunctionNode[]): void {
    Sidebar2Component.functionNodes = data;
    Sidebar2Component.rebuildIndexes();
  }

  static findByName(name: string): FunctionNode | null {
    const normalized = name?.trim().toLowerCase();
    if (!normalized) return null;
    Sidebar2Component.buildIndexes();
    return Sidebar2Component.nameIndex!.get(normalized) ?? null;
  }

  static findByCategory(category: string): FunctionNode[] {
    const normalized = category?.trim().toLowerCase();
    if (!normalized) return [];
    Sidebar2Component.buildIndexes();
    return Sidebar2Component.categoryIndex!.get(normalized) ?? [];
  }

  static getCategories(): string[] {
    Sidebar2Component.buildIndexes();
    return Array.from(Sidebar2Component.categoryIndex!.keys());
  }

  // --- Instance members ---
  @Output() itemSelected = new EventEmitter<{ section: string; label: string }>();
  @Output() menuClickSidebar2 = new EventEmitter<{ section: string; label: string; description?: string; syntax?: string; category?: string }>(); // Emit the whole item object

  selectedItem: { section: string; label: string } | null = null;
  selectedDescription: string = '';

  minWidth: number = 0;
  maxWidth: number = 0;

  isOpen: boolean = true;
  isResizing: boolean = false;
  currentWidth: number = 0;
  isHeadingMenuOpen: boolean = false;
  isLoading: boolean = true;

  private startX: number = 0;
  private startWidth: number = 0;
  private subscriptions: Subscription[] = [];

  // Dynamic categories built from backend data
  functionCategories: { name: string; icon: string; items: FunctionNode[] }[] = [];

  openSections: any = {
    projects: false,
    functions: { main: false },
    userFunction: true,
    object: true
  };

  isLocked: boolean = false;

  constructor(
    private engineService: EngineService,
    private functionDataService: FunctionDataService
  ) {}

  //This runs once when the sidebar first loads on screen.
  ngOnInit(): void {
    this.minWidth = 0;
    this.maxWidth = window.innerWidth * 0.30;
    this.currentWidth = window.innerWidth * 0.15;

    this.subscriptions.push(
      this.engineService.isEngineBusy$.subscribe((status: boolean) => {
        this.isLocked = status;
      })
    );

    // Fetch function data from backend
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private buildDynamicSections(nodes: FunctionNode[]): void {
    const categoryMap = new Map<string, FunctionNode[]>();
    for (const node of nodes) {
      const bucket = categoryMap.get(node.main_categori);
      if (bucket) {
        bucket.push(node);
      } else {
        categoryMap.set(node.main_categori, [node]);
      }
    }
    this.functionCategories = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      icon: this.functionDataService.getCategoryIcon(name),
      items
    }));

    // Build openSections.functions dynamically
    this.openSections.functions = { main: true };
    for (const cat of this.functionCategories) {
      this.openSections.functions[cat.name] = true;
    }
  }

  /* ----- Child item click ----- */
  selectItem(section: string, label: string, event: MouseEvent): void {
    
    if (this.isLocked) {
      alert("Please wait. CALGORIC is processing a heavy workflow.");
      return;
    }
    event.stopPropagation();
    this.selectedItem = { section, label };

    // Look up sort_description for functions
    if (section === 'functions') {
      const fn = Sidebar2Component.findByName(label);
      if (fn) {
        this.selectedDescription = fn.sort_description;
        this.menuClickSidebar2.emit({ section, label, description: fn.sort_description, syntax: fn.syntax, category: fn.main_categori });
      } else {
        // Fallback: label might be a category name — show its functions' descriptions
        const catFunctions = Sidebar2Component.findByCategory(label);
        if (catFunctions.length > 0) {
          this.selectedDescription = catFunctions.map(f => f.func_name).join(', ');
        } else {
          this.selectedDescription = label;
        }
        this.menuClickSidebar2.emit({ section, label, description: this.selectedDescription });
      }
    } else {
      this.selectedDescription = '';
      this.menuClickSidebar2.emit({ section, label });
    }
  }

  isItemSelected(section: string, label: string): boolean {
    return this.selectedItem?.section === section && this.selectedItem?.label === label;
  }

  trackByCategory(index: number, cat: { name: string }): string {
    return cat.name;
  }

  trackByItem(index: number, item: FunctionNode): string {
    return item.func_name;
  }

  // Lookup helpers requested
  getFunctionByName(name: string): FunctionNode | null {
    return Sidebar2Component.findByName(name);
  }

  getFunctionsByCategory(category: string): FunctionNode[] {
    return Sidebar2Component.findByCategory(category);
  }

  /* ----- Section toggle ----- */
  toggleSection(section: string): void {
    if (section === 'functions') {
      this.openSections.functions.main = !this.openSections.functions.main;
    } else if (section.startsWith('functions-')) {
      const sub = section.substring(10); // 'functions-'.length
      this.openSections.functions[sub] = !this.openSections.functions[sub];
    } else {
      this.openSections[section] = !this.openSections[section];
    }
  }

  /* ----- Sidebar open/close ----- */
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.currentWidth = window.innerWidth * 0.15;
    } else {
      this.currentWidth = 0;
    }
  }

  /* ----- Heading 3-dot menu ----- */
  toggleHeadingMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isHeadingMenuOpen = !this.isHeadingMenuOpen;
  }

  /* ----- Close all sections ----- */
  closeAll(): void {
    this.openSections.projects = false;
    this.openSections.functions.main = false;
    Object.keys(this.openSections.functions).forEach(key => {
      if (key !== 'main') this.openSections.functions[key] = false;
    });
    this.openSections.userFunction = false;
    this.openSections.object = false;
    this.isHeadingMenuOpen = false;
  }

  /* ----- Open all sections ----- */
  openAll(): void {
    this.openSections.projects = true;
    this.openSections.functions.main = true;
    Object.keys(this.openSections.functions).forEach(key => {
      if (key !== 'main') this.openSections.functions[key] = true;
    });
    this.openSections.userFunction = true;
    this.openSections.object = true;
    this.isHeadingMenuOpen = false;
  }

  /* ----- Collapse all (alias for closeAll) ----- */
  collapseAll(): void {
    this.closeAll();
  }

  /* ----- Expand all (alias for openAll) ----- */
  expandAll(): void {
    this.openAll();
  }

  /* ----- Close sidebar from dropdown ----- */
  closeSidebar(): void {
    this.isOpen = false;
    this.currentWidth = 0;
    this.isHeadingMenuOpen = false;
  }

  /* ----- Resize ----- */
  startResize(event: MouseEvent): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.currentWidth;
    event.preventDefault();
  }

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

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isResizing = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isHeadingMenuOpen = false;
  }

  get sidebarWidth(): string {
    return `${this.currentWidth}px`;
  }
}
