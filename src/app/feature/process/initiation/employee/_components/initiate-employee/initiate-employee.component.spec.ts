import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateEmployeeComponent } from './initiate-employee.component';

describe('InitiateEmployeeComponent', () => {
  let component: InitiateEmployeeComponent;
  let fixture: ComponentFixture<InitiateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
