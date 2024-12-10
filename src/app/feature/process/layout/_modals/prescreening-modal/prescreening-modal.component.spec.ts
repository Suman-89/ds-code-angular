import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescreeningModalComponent } from './prescreening-modal.component';

describe('PrescreeningModalComponent', () => {
  let component: PrescreeningModalComponent;
  let fixture: ComponentFixture<PrescreeningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescreeningModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescreeningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
