import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefdataFormComponent } from './refdata-form.component';

describe('RefdataFormComponent', () => {
  let component: RefdataFormComponent;
  let fixture: ComponentFixture<RefdataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefdataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefdataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
