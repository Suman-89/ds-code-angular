import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWorkflowTypeComponent } from './select-workflow-type.component';

describe('SelectWorkflowTypeComponent', () => {
  let component: SelectWorkflowTypeComponent;
  let fixture: ComponentFixture<SelectWorkflowTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWorkflowTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWorkflowTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
