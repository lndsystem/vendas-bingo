import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultPixComponent } from './consult-pix.component';

describe('ConsultPixComponent', () => {
  let component: ConsultPixComponent;
  let fixture: ComponentFixture<ConsultPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultPixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
