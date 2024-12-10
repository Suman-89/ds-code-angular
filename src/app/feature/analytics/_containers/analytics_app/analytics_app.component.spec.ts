import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAppComponent } from './analytics_app.component';

describe('ReportsComponent', () => {
  let component: AnalyticsAppComponent;
  let fixture: ComponentFixture<AnalyticsAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
