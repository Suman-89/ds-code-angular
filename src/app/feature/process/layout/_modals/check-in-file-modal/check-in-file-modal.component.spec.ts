import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInFileModalComponent } from './check-in-file-modal.component';

describe('CheckInFileModalComponent', () => {
  let component: CheckInFileModalComponent;
  let fixture: ComponentFixture<CheckInFileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInFileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
