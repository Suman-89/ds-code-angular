import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayHistoryComponent } from './display-history.component';

describe('DisplayHistoryComponent', () => {
  let component: DisplayHistoryComponent;
  let fixture: ComponentFixture<DisplayHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
