import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGridSettingsComponent } from './general-grid-settings.component';

describe('GeneralGridSettingsComponent', () => {
  let component: GeneralGridSettingsComponent;
  let fixture: ComponentFixture<GeneralGridSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralGridSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralGridSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
