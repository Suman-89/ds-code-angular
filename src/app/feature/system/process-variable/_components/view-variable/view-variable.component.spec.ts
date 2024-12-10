import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVariableComponent } from './view-variable.component';

describe('ViewVariableComponent', () => {
  let component: ViewVariableComponent;
  let fixture: ComponentFixture<ViewVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
