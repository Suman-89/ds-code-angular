import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompanyComponent } from './add-edit-company.component';

describe('AddEditCompanyComponent', () => {
  let component: AddEditCompanyComponent;
  let fixture: ComponentFixture<AddEditCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
