import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProcessEmployeeComponent } from './start-process-employee.component';

describe('StartProcessEmployeeComponent', () => {
  let component: StartProcessEmployeeComponent;
  let fixture: ComponentFixture<StartProcessEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartProcessEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartProcessEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
