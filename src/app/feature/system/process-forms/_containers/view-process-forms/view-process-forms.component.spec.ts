import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcessFormsComponent } from './view-process-forms.component';

describe('ViewProcessFormsComponent', () => {
  let component: ViewProcessFormsComponent;
  let fixture: ComponentFixture<ViewProcessFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProcessFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProcessFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
