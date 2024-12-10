import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BltPriceListComponent } from './blt-price-list.component';

describe('BltPriceListComponent', () => {
  let component: BltPriceListComponent;
  let fixture: ComponentFixture<BltPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BltPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BltPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
