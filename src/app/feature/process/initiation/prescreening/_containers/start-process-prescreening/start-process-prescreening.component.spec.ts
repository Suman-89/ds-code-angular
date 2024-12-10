import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProcessPrescreeningComponent } from './start-process-prescreening.component';

describe('StartProcessPrescreeningComponent', () => {
  let component: StartProcessPrescreeningComponent;
  let fixture: ComponentFixture<StartProcessPrescreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartProcessPrescreeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartProcessPrescreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
