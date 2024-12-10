import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendlyAddressComponent } from './friendly-address.component';

describe('FriendlyAddressComponent', () => {
  let component: FriendlyAddressComponent;
  let fixture: ComponentFixture<FriendlyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendlyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendlyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
