import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatSelectAdvancedComponent } from './ngx-mat-select-advanced.component';

describe('NgxMatSelectAdvancedComponent', () => {
  let component: NgxMatSelectAdvancedComponent;
  let fixture: ComponentFixture<NgxMatSelectAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatSelectAdvancedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMatSelectAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
