import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSnowDealComponent } from './start-snow-deal.component';

describe('StartSnowDealComponent', () => {
  let component: StartSnowDealComponent;
  let fixture: ComponentFixture<StartSnowDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSnowDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSnowDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
