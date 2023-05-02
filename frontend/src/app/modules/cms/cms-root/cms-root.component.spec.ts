import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsRootComponent } from './cms-root.component';

describe('CmsRootComponent', () => {
  let component: CmsRootComponent;
  let fixture: ComponentFixture<CmsRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsRootComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
