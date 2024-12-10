import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BltPricingConfigComponent } from './blt-pricing-config.component';

describe('BltPricingConfigComponent', () => {
  let component: BltPricingConfigComponent;
  let fixture: ComponentFixture<BltPricingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BltPricingConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BltPricingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
