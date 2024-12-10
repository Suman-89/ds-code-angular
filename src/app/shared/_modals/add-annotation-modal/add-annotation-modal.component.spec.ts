import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnotationModalComponent } from './add-annotation-modal.component';

describe('AddAnnotationModalComponent', () => {
  let component: AddAnnotationModalComponent;
  let fixture: ComponentFixture<AddAnnotationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnnotationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnotationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
