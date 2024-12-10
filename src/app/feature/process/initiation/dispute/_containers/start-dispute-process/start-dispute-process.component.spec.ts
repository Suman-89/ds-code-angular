import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDisputeProcessComponent } from './start-dispute-process.component';

describe('StartDisputeProcessComponent', () => {
  let component: StartDisputeProcessComponent;
  let fixture: ComponentFixture<StartDisputeProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartDisputeProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartDisputeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
