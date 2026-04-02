import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, catchError, tap } from 'rxjs';
import { FunctionNode } from './sidebar2';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, string> = {
  'Syntax': 'func/syntax2.png',
  'IO': 'func/IO2.png',
  'Binary & Memory': 'func/bin2.png',
  'System Info': 'func/sys2.png',
  'Files & Folders': 'func/filefolder2.png',
  'String': 'func/str2.png',
  'Date & Time': 'func/dt2.png',
  'Table & Field': 'func/table2.png',
  'Matrix Operation': 'func/mtrx2.png',
  'Mathematics': 'func/sfun2.png',
  'Linear Algebra': 'func/algb2.png',
  'Geometry': 'func/geom2.png',
  'Integration': 'func/int2.png',
  'Polynomial & BSpline': 'func/poly2.png',
  'Optimization & Equation Solver': 'func/optm2.png',
  'Data Function': 'func/datafun2.png',
  'Statistics': 'func/stat2.png',
  'Regression': 'func/reg2.png',
  'Machine Learning': 'func/ml2.png',
  'Finance': 'func/fin2.png',
  'Signal Processing': 'func/sign2.png',
  'Image Processing': 'func/Image2.png',
  'Database Functions': 'func/db2.png',
  'Others': 'func/others2.png',
};

@Injectable({
  providedIn: 'root'
})
export class FunctionDataService {

  private readonly API_URL = 'assets/functions.json';

  /** Live stream of all functions — sidebar subscribes to this */
  private functionsSubject = new BehaviorSubject<FunctionNode[]>([]);
  functions$ = this.functionsSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all function nodes from the backend.
   * Caches the result so multiple subscribers share one HTTP call.
   * Falls back to built-in data if the backend is unreachable.
   */
  getFunctions(): Observable<FunctionNode[]> {
    if (!this.loaded) {
      this.http.get<FunctionNode[]>(this.API_URL).pipe(
        catchError(err => {
          console.warn('Backend unreachable, no data available:', err.message);
          return of([]);
        }),
        tap(data => {
          this.functionsSubject.next(data);
          this.loaded = true;
        })
      ).subscribe();
    }
    return this.functions$;
  }

  /** Clear cache to force a fresh fetch on next call */
  clearCache(): void {
    this.loaded = false;
  }

  /** Add a new function */
  addFunction(fn: FunctionNode): boolean {
    const current = this.functionsSubject.value;
    const exists = current.some(f => f.func_name.toLowerCase() === fn.func_name.toLowerCase());
    if (exists) return false;
    this.functionsSubject.next([...current, fn]);
    return true;
  }

  /** Update an existing function by func_name */
  updateFunction(fn: FunctionNode): boolean {
    const current = this.functionsSubject.value;
    const idx = current.findIndex(f => f.func_name.toLowerCase() === fn.func_name.toLowerCase());
    if (idx === -1) return false;
    const updated = [...current];
    updated[idx] = { ...fn };
    this.functionsSubject.next(updated);
    return true;
  }

  /** Delete a function by func_name */
  deleteFunction(funcName: string): boolean {
    const current = this.functionsSubject.value;
    const idx = current.findIndex(f => f.func_name.toLowerCase() === funcName.toLowerCase());
    if (idx === -1) return false;
    const updated = current.filter((_, i) => i !== idx);
    this.functionsSubject.next(updated);
    return true;
  }

  /** Get the icon path for a category */
  getCategoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? 'func/others2.png';
  }
}
