import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateReasonComponent } from './terminate-reason.component';

describe('TerminateReasonComponent', () => {
  let component: TerminateReasonComponent;
  let fixture: ComponentFixture<TerminateReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
