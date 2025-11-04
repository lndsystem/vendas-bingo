import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixResultComponent } from './pix-result.component';

describe('PixResultComponent', () => {
  let component: PixResultComponent;
  let fixture: ComponentFixture<PixResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
