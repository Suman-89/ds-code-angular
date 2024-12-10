import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceExtractMortgageComponent } from './invoice-extract-mortgage.component';

describe('InvoiceExtractMortgageComponent', () => {
  let component: InvoiceExtractMortgageComponent;
  let fixture: ComponentFixture<InvoiceExtractMortgageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceExtractMortgageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceExtractMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
