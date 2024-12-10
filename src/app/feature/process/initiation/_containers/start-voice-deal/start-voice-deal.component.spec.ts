import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartVoiceDealComponent } from './start-voice-deal.component';

describe('StartVoiceDealComponent', () => {
  let component: StartVoiceDealComponent;
  let fixture: ComponentFixture<StartVoiceDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartVoiceDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartVoiceDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
