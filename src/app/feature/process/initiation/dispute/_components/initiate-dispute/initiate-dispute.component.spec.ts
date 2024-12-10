import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateDisputeComponent } from './initiate-dispute.component';

describe('InitiateDisputeComponent', () => {
  let component: InitiateDisputeComponent;
  let fixture: ComponentFixture<InitiateDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateDisputeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
