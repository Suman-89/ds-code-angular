import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectToggleComponent } from './multiselect-toggle.component';

describe('MultiselectToggleComponent', () => {
  let component: MultiselectToggleComponent;
  let fixture: ComponentFixture<MultiselectToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
