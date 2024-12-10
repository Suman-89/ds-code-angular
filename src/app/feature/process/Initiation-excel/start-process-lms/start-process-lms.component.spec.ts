import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartProcessLmsComponent } from './start-process-lms.component';

describe('StartProcessLmsComponent', () => {
  let component: StartProcessLmsComponent;
  let fixture: ComponentFixture<StartProcessLmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartProcessLmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartProcessLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
