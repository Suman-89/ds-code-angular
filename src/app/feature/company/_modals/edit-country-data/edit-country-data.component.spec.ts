import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountryDataComponent } from './edit-country-data.component';

describe('EditCountryDataComponent', () => {
  let component: EditCountryDataComponent;
  let fixture: ComponentFixture<EditCountryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCountryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCountryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
