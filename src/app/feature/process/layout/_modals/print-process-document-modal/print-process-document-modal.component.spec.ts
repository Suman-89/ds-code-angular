import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProcessDocumentModalComponent } from './print-process-document-modal.component';

describe('PrintProcessDocumentModalComponent', () => {
  let component: PrintProcessDocumentModalComponent;
  let fixture: ComponentFixture<PrintProcessDocumentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProcessDocumentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProcessDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
