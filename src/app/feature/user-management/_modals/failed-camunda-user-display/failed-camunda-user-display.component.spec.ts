import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedCamundaUserDisplayComponent } from './failed-camunda-user-display.component';

describe('FailedCamundaUserDisplayComponent', () => {
  let component: FailedCamundaUserDisplayComponent;
  let fixture: ComponentFixture<FailedCamundaUserDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedCamundaUserDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedCamundaUserDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
