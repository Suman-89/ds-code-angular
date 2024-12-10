import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMortgageProcessComponent } from './start-mortgage-process.component';

describe('StartMortgageProcessComponent', () => {
  let component: StartMortgageProcessComponent;
  let fixture: ComponentFixture<StartMortgageProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartMortgageProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartMortgageProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
