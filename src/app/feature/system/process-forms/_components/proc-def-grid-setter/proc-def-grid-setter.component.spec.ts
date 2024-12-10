import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcDefGridSetterComponent } from './proc-def-grid-setter.component';

describe('ProcDefGridSetterComponent', () => {
  let component: ProcDefGridSetterComponent;
  let fixture: ComponentFixture<ProcDefGridSetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcDefGridSetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcDefGridSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
