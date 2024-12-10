import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnchorElementsComponent } from './add-anchor-elements.component';

describe('AddProcessFormsComponent', () => {
  let component: AddAnchorElementsComponent;
  let fixture: ComponentFixture<AddAnchorElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnchorElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnchorElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
