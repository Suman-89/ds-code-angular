import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGeneralSettingsComponent } from './add-edit-general-settings.component';

describe('AddEditProcdefFormComponent', () => {
  let component: AddEditGeneralSettingsComponent;
  let fixture: ComponentFixture<AddEditGeneralSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditGeneralSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
