import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiationLandingComponent } from './initiation-landing.component';

describe('InitiationLandingComponent', () => {
  let component: InitiationLandingComponent;
  let fixture: ComponentFixture<InitiationLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiationLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
