import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsEmployeeComponent } from './company-details-employee.component';

describe('CompanyDetailsEmployeeComponent', () => {
  let component: CompanyDetailsEmployeeComponent;
  let fixture: ComponentFixture<CompanyDetailsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDetailsEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
