import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
  MatDialog,
  MatDialogClose,
  MatDialogRef,
  MatGridList,
  MatGridTile,
  MatIcon
} from '@angular/material';
import { DialogData, HomeComponent } from './home.component';

// tslint:disable: no-string-literal
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const options = [
    {
      icon: 'add',
      message: 'Créer un nouveau dessin',
      dialogCloseResult: 'new',
      canDisplay: true
    },
    {
      icon: 'photo_library',
      message: 'Aller à la galerie',
      dialogCloseResult: 'library',
      canDisplay: true
    },
    {
      icon: 'menu_book',
      message: "Guide d'utilisation",
      dialogCloseResult: 'documentation',
      canDisplay: true
    },
    {
      icon: 'save',
      message: 'Continuer un ancien dessin',
      dialogCloseResult: 'continue',
      canDisplay: true
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        HomeComponent,
        MatDialogClose,
        MatIcon,
        MatGridTile,
        MatGridList
      ],
      providers: [
        Overlay,
        MatDialog,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#constructor should set option[0].canDisplay to true', () => {
    component['options'] = options;

    const dialogRef = component.dialogRef;
    const data: DialogData = { drawInProgress: true };
    component = new HomeComponent(dialogRef, data);

    expect(component['options'][0].canDisplay).toBe(true);
  });

  it('#constructor should set option[0].canDisplay to false', () => {
    component['options'] = options;

    const dialogRef = component.dialogRef;
    const data: DialogData = { drawInProgress: false };

    component = new HomeComponent(dialogRef, data);

    expect(component['options'][0].canDisplay).toBe(false);
  });
});
