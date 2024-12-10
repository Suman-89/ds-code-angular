import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessFormsComponent } from './add-process-forms.component';

describe('AddProcessFormsComponent', () => {
  let component: AddProcessFormsComponent;
  let fixture: ComponentFixture<AddProcessFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProcessFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcessFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
