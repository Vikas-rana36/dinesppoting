import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustSafetyComponent } from './trust-safety.component';

describe('TrustSafetyComponent', () => {
  let component: TrustSafetyComponent;
  let fixture: ComponentFixture<TrustSafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrustSafetyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
