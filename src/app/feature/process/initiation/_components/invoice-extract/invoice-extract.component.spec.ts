import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceExtractComponent } from './invoice-extract.component';

describe('InvoiceExtractComponent', () => {
  let component: InvoiceExtractComponent;
  let fixture: ComponentFixture<InvoiceExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
