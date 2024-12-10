import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVariableComponent } from './add-variable.component';

describe('AddVariableComponent', () => {
  let component: AddVariableComponent;
  let fixture: ComponentFixture<AddVariableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
