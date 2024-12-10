import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUploadInitiationComponent } from './doc-upload-initiation.component';

describe('DocUploadInitiationComponent', () => {
  let component: DocUploadInitiationComponent;
  let fixture: ComponentFixture<DocUploadInitiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocUploadInitiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploadInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
