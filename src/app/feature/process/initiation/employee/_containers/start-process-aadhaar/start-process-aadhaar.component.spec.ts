import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProcessAadhaarComponent } from './start-process-aadhaar.component';

describe('StartProcessAadhaarComponent', () => {
  let component: StartProcessAadhaarComponent;
  let fixture: ComponentFixture<StartProcessAadhaarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartProcessAadhaarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartProcessAadhaarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
