import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnAppleComponent } from './btn-apple.component';

describe('BtnAppleComponent', () => {
  let component: BtnAppleComponent;
  let fixture: ComponentFixture<BtnAppleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnAppleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnAppleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
