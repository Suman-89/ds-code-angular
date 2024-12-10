import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderModalComponent } from './file-uploader-modal.component';

describe('FileUploaderModalComponent', () => {
  let component: FileUploaderModalComponent;
  let fixture: ComponentFixture<FileUploaderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploaderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
