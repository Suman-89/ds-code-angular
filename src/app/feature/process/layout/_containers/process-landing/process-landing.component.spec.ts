import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLandingComponent } from './process-landing.component';

describe('ProcessLandingComponent', () => {
  let component: ProcessLandingComponent;
  let fixture: ComponentFixture<ProcessLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
