import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditProcdefFormComponent } from '../../../process-forms/_containers';



describe('AddEditProcdefFormComponent', () => {
  let component: AddEditProcdefFormComponent;
  let fixture: ComponentFixture<AddEditProcdefFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProcdefFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProcdefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
