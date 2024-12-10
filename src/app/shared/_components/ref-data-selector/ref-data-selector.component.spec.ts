import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefDataSelectorComponent } from './ref-data-selector.component';

describe('FriendlyAddressComponent', () => {
  let component: RefDataSelectorComponent;
  let fixture: ComponentFixture<RefDataSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefDataSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefDataSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
