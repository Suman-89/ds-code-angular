import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAiAttributesComponent } from './view-ai-attributes.component';

describe('ViewProcessFormsComponent', () => {
  let component: ViewAiAttributesComponent;
  let fixture: ComponentFixture<ViewAiAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAiAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAiAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
