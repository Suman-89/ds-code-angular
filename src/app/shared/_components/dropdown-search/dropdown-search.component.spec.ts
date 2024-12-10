import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSearchComponent } from './dropdown-search.component';

describe('FriendlyAddressComponent', () => {
  let component: DropdownSearchComponent;
  let fixture: ComponentFixture<DropdownSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
