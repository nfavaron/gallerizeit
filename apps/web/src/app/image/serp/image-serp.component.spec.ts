import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSerpComponent } from './image-serp.component';

describe('ImageSerpComponent', () => {
  let component: ImageSerpComponent;
  let fixture: ComponentFixture<ImageSerpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSerpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSerpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
