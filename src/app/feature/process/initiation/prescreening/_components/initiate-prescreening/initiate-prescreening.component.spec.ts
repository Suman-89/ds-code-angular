import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatePrescreeningComponent } from './initiate-prescreening.component';

describe('InitiatePrescreeningComponent', () => {
  let component: InitiatePrescreeningComponent;
  let fixture: ComponentFixture<InitiatePrescreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatePrescreeningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatePrescreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
