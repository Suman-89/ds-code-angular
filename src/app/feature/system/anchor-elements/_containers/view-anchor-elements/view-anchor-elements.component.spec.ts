import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnchorElementsComponent } from './view-anchor-elements.component';

describe('ViewAnchorElementsComponent', () => {
  let component: ViewAnchorElementsComponent;
  let fixture: ComponentFixture<ViewAnchorElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAnchorElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnchorElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
