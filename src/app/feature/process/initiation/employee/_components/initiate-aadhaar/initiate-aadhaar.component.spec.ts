import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateAadhaarComponent } from './initiate-aadhaar.component';

describe('InitiateAadhaarComponent', () => {
  let component: InitiateAadhaarComponent;
  let fixture: ComponentFixture<InitiateAadhaarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateAadhaarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateAadhaarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
