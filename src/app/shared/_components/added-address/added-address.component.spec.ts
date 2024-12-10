import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedAddressComponent } from './added-address.component';

describe('AddedAddressComponent', () => {
  let component: AddedAddressComponent;
  let fixture: ComponentFixture<AddedAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
