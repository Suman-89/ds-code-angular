import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadhaarExtractComponent } from './aadhaar-extract.component';

describe('AadhaarExtractComponent', () => {
  let component: AadhaarExtractComponent;
  let fixture: ComponentFixture<AadhaarExtractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadhaarExtractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadhaarExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
