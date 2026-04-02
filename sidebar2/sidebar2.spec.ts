import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebar2Component, FunctionNode } from './sidebar2';

describe('Sidebar2Component', () => {
  let component: Sidebar2Component;
  let fixture: ComponentFixture<Sidebar2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidebar2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('finds function by exact name', () => {
    const result = component.getFunctionByName('Basic Syntax');
    expect(result).toEqual(jasmine.objectContaining({ category: 'Syntax', name: 'Basic Syntax' }));
  });

  it('returns null when function name is not found', () => {
    expect(component.getFunctionByName('NotExisting')).toBeNull();
  });

  it('returns functions by category list', () => {
    const results = component.getFunctionsByCategory('Syntax');
    expect(Array.isArray(results)).toBeTrue();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.category === 'Syntax')).toBeTrue();
  });

  it('returns empty array for unknown category', () => {
    expect(component.getFunctionsByCategory('UnknownCategory')).toEqual([]);
  });
});
