import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExportModalComponent } from './confirm-export-modal.component';

describe('ConfirmExportModalComponent', () => {
  let component: ConfirmExportModalComponent;
  let fixture: ComponentFixture<ConfirmExportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmExportModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
