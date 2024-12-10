import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateMortgageComponent } from './initiate-mortgage.component';

describe('InitiateMortgageComponent', () => {
  let component: InitiateMortgageComponent;
  let fixture: ComponentFixture<InitiateMortgageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateMortgageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
