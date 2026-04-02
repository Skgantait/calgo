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

// Fallback data used when backend is unreachable
const FALLBACK_DATA: FunctionNode[] = [
  { func_name: 'Basic Syntax', sort_description: 'Basic syntax constructs.', main_categori: 'Syntax', syntax: 'basic_syntax()' },
  { func_name: 'Advanced Syntax', sort_description: 'Advanced syntax constructs.', main_categori: 'Syntax', syntax: 'advanced_syntax()' },
  { func_name: 'Syntax Examples', sort_description: 'Example syntax patterns.', main_categori: 'Syntax', syntax: 'syntax_examples()' },
  { func_name: 'File IO', sort_description: 'File input/output operations.', main_categori: 'IO', syntax: 'file_io(path)' },
  { func_name: 'Read File', sort_description: 'Read data from a file.', main_categori: 'IO', syntax: 'read_file(path)' },
  { func_name: 'Write File', sort_description: 'Write data to a file.', main_categori: 'IO', syntax: 'write_file(path,data)' },
  { func_name: 'Memory Allocation', sort_description: 'Allocate memory blocks.', main_categori: 'Binary & Memory', syntax: 'mem_alloc(size)' },
  { func_name: 'Binary Operations', sort_description: 'Binary data operations.', main_categori: 'Binary & Memory', syntax: 'bin_op(a,b)' },
  { func_name: 'CPU Info', sort_description: 'Retrieve CPU information.', main_categori: 'System Info', syntax: 'cpu_info()' },
  { func_name: 'Memory Info', sort_description: 'Retrieve memory information.', main_categori: 'System Info', syntax: 'mem_info()' },
  { func_name: 'File Operations', sort_description: 'File management operations.', main_categori: 'Files & Folders', syntax: 'file_ops(path)' },
  { func_name: 'Directory Operations', sort_description: 'Directory management operations.', main_categori: 'Files & Folders', syntax: 'dir_ops(path)' },
  { func_name: 'String Length', sort_description: 'Get the length of a string.', main_categori: 'String', syntax: 'strlen(s)' },
  { func_name: 'String Concat', sort_description: 'Concatenate strings.', main_categori: 'String', syntax: 'strcat(a,b)' },
  { func_name: 'Date Formatting', sort_description: 'Format date values.', main_categori: 'Date & Time', syntax: 'date_format(d,fmt)' },
  { func_name: 'Time Calculations', sort_description: 'Perform time calculations.', main_categori: 'Date & Time', syntax: 'time_calc(t1,t2)' },
  { func_name: 'Table Creation', sort_description: 'Create a data table.', main_categori: 'Table & Field', syntax: 'table_create(cols)' },
  { func_name: 'Field Manipulation', sort_description: 'Manipulate table fields.', main_categori: 'Table & Field', syntax: 'field_manip(table,field)' },
  { func_name: 'Matrix Addition', sort_description: 'Add two matrices.', main_categori: 'Matrix Operation', syntax: 'mat_add(A,B)' },
  { func_name: 'Matrix Multiplication', sort_description: 'Multiply two matrices.', main_categori: 'Matrix Operation', syntax: 'mat_mul(A,B)' },
  { func_name: 'Trigonometric Functions', sort_description: 'Trigonometric math functions.', main_categori: 'Mathematics', syntax: 'trig(x)' },
  { func_name: 'Exponential Functions', sort_description: 'Exponential math functions.', main_categori: 'Mathematics', syntax: 'exp(x)' },
  { func_name: 'Vector Operations', sort_description: 'Perform vector operations.', main_categori: 'Linear Algebra', syntax: 'vec_op(v1,v2)' },
  { func_name: 'Matrix Inversion', sort_description: 'Invert a matrix.', main_categori: 'Linear Algebra', syntax: 'mat_inv(A)' },
  { func_name: 'Geometric Shapes', sort_description: 'Geometric shape calculations.', main_categori: 'Geometry', syntax: 'geo_shape(type,params)' },
  { func_name: 'Coordinate Systems', sort_description: 'Coordinate system transformations.', main_categori: 'Geometry', syntax: 'coord_sys(x,y,z)' },
  { func_name: 'Trapezoidal Rule', sort_description: 'Numerical integration via trapezoidal rule.', main_categori: 'Integration', syntax: 'trapz(f,a,b)' },
  { func_name: 'Simpson\'s Rule', sort_description: 'Numerical integration via Simpson\'s rule.', main_categori: 'Integration', syntax: 'simps(f,a,b)' },
  { func_name: 'Polynomial Evaluation', sort_description: 'Evaluate a polynomial.', main_categori: 'Polynomial & BSpline', syntax: 'polyval(p,x)' },
  { func_name: 'BSpline Curves', sort_description: 'B-spline curve evaluation.', main_categori: 'Polynomial & BSpline', syntax: 'bspline(knots,ctrl,t)' },
  { func_name: 'Linear Optimization', sort_description: 'Solve linear optimization problems.', main_categori: 'Optimization & Equation Solver', syntax: 'linopt(c,A,b)' },
  { func_name: 'Nonlinear Equations', sort_description: 'Solve nonlinear equations.', main_categori: 'Optimization & Equation Solver', syntax: 'nleq(f,x0)' },
  { func_name: 'Data Filtering', sort_description: 'Filter data sets.', main_categori: 'Data Function', syntax: 'data_filter(data,cond)' },
  { func_name: 'Data Aggregation', sort_description: 'Aggregate data sets.', main_categori: 'Data Function', syntax: 'data_agg(data,func)' },
  { func_name: 'Descriptive Statistics', sort_description: 'Compute descriptive statistics.', main_categori: 'Statistics', syntax: 'desc_stat(data)' },
  { func_name: 'Inferential Statistics', sort_description: 'Perform inferential statistics.', main_categori: 'Statistics', syntax: 'inf_stat(data,alpha)' },
  { func_name: 'Linear Regression', sort_description: 'Fit a linear regression model.', main_categori: 'Regression', syntax: 'linreg(X,y)' },
  { func_name: 'Polynomial Regression', sort_description: 'Fit a polynomial regression model.', main_categori: 'Regression', syntax: 'polyreg(X,y,degree)' },
  { func_name: 'Supervised Learning', sort_description: 'Supervised machine learning.', main_categori: 'Machine Learning', syntax: 'supervised(X,y,model)' },
  { func_name: 'Unsupervised Learning', sort_description: 'Unsupervised machine learning.', main_categori: 'Machine Learning', syntax: 'unsupervised(X,model)' },
  { func_name: 'Financial Calculations', sort_description: 'Financial math calculations.', main_categori: 'Finance', syntax: 'fin_calc(rate,periods)' },
  { func_name: 'Risk Analysis', sort_description: 'Perform risk analysis.', main_categori: 'Finance', syntax: 'risk(portfolio)' },
  { func_name: 'Fourier Transform', sort_description: 'Compute Fourier transform.', main_categori: 'Signal Processing', syntax: 'fft(signal)' },
  { func_name: 'Filtering', sort_description: 'Apply signal filters.', main_categori: 'Signal Processing', syntax: 'filter(signal,type)' },
  { func_name: 'Image Filtering', sort_description: 'Apply image filters.', main_categori: 'Image Processing', syntax: 'img_filter(img,kernel)' },
  { func_name: 'Image Segmentation', sort_description: 'Segment an image.', main_categori: 'Image Processing', syntax: 'img_seg(img,method)' },
  { func_name: 'Query Operations', sort_description: 'Perform database queries.', main_categori: 'Database Functions', syntax: 'db_query(sql)' },
  { func_name: 'Data Manipulation', sort_description: 'Manipulate database data.', main_categori: 'Database Functions', syntax: 'db_manip(table,op)' },
  { func_name: 'Miscellaneous Functions', sort_description: 'Miscellaneous utility functions.', main_categori: 'Others', syntax: 'misc()' },
  { func_name: 'Custom Operations', sort_description: 'Custom user operations.', main_categori: 'Others', syntax: 'custom(args)' },
];

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
          console.warn('Backend unreachable, using fallback data:', err.message);
          return of(FALLBACK_DATA);
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
