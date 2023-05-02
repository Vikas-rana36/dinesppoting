import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewGuidelinesComponent } from './review-guidelines.component';

describe('ReviewGuidelinesComponent', () => {
  let component: ReviewGuidelinesComponent;
  let fixture: ComponentFixture<ReviewGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewGuidelinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
