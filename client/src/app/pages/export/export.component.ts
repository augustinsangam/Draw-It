import { Component, Optional } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  protected form: FormGroup;

  protected filters = [
    FilterChoice.None,
    FilterChoice.Blur,
    FilterChoice.BandW,
    FilterChoice.Inverse,
    FilterChoice.Artifice,
    FilterChoice.Grey
  ];

  constructor(private formBuilder: FormBuilder,
              @Optional() public dialogRef: MatDialogRef<ExportComponent>) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, (control: FormControl) => {
        const input = (control.value as string).trim();
        return (input.indexOf(' ') === -1 && input !== '') ? null : {
          spaceError: { value: 'No whitespace allowed' }
        };
      }]]
    });
  }

  protected onOptionChange($change: MatRadioChange) {
    console.log($change);
  }

  protected onConfirm() {
    console.log('On confirme');
    this.dialogRef.close();
  }

  protected onCancel() {
    console.log('On cancel');
    this.dialogRef.close();
  }

}

enum FilterChoice {
  None = 'Aucun',
  Blur = 'Flou',
  BandW = 'Noir et blanc',
  Inverse = 'Inversion',
  Artifice = 'Artifice',
  Grey = 'Gris épatant'
}
