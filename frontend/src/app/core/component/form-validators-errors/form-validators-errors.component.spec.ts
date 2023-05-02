import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidatorsErrorsComponent } from './form-validators-errors.component';

describe('FormValidatorsErrorsComponent', () => {
  let component: FormValidatorsErrorsComponent;
  let fixture: ComponentFixture<FormValidatorsErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormValidatorsErrorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormValidatorsErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
