import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextTaskComponent } from './next-task.component';

describe('NextTaskComponent', () => {
  let component: NextTaskComponent;
  let fixture: ComponentFixture<NextTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
