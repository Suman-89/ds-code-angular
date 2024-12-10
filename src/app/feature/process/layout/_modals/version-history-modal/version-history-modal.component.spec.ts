import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionHistoryModalComponent } from './version-history-modal.component';

describe('VersionHistoryModalComponent', () => {
  let component: VersionHistoryModalComponent;
  let fixture: ComponentFixture<VersionHistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionHistoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
