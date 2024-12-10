import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContentTemplateComponent } from './add-edit-content-template.component';

describe('AddEditContentTemplateComponent', () => {
  let component: AddEditContentTemplateComponent;
  let fixture: ComponentFixture<AddEditContentTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditContentTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditContentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
