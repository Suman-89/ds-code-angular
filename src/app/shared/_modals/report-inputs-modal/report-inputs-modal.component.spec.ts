import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInputsModalComponent } from './report-inputs-modal.component';

describe('ReportInputsModalComponent', () => {
  let component: ReportInputsModalComponent;
  let fixture: ComponentFixture<ReportInputsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportInputsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInputsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
