import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTaskComponent } from './compare-task.component';

describe('CompareTaskComponent', () => {
  let component: CompareTaskComponent;
  let fixture: ComponentFixture<CompareTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
