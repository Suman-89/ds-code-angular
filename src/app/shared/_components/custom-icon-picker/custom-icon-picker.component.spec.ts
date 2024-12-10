import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIconPickerComponent } from './custom-icon-picker.component';

describe('FriendlyAddressComponent', () => {
  let component: CustomIconPickerComponent;
  let fixture: ComponentFixture<CustomIconPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomIconPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIconPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
