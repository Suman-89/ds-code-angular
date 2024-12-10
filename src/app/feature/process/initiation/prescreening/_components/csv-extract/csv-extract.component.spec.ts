import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvExtractComponent } from './csv-extract.component';

describe('CsvExtractComponent', () => {
  let component: CsvExtractComponent;
  let fixture: ComponentFixture<CsvExtractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvExtractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
