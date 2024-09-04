import { V } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-customer-contact-form',
  templateUrl: './customer-contact-form.component.html',
  styleUrl: './customer-contact-form.component.css'
})
export class CustomerContactFormComponent {

  form: FormGroup;
  fb: FormBuilder = new FormBuilder;  // we'll want to be able to access this later outside of the controller
  customErrorStateMatcher: ErrorStateMatcher = new CustomErrorStateMatcher();
  
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: [ 'John', Validators.compose([ Validators.required, this.forbiddenNameValidator() ]) ],
      lastName: ['Tooth', Validators.required],
      email: [ 'john.doe@example.com', Validators.compose([ Validators.required, Validators.email ]) ],      phoneNumbers: fb.array([fb.group({
        alias: ['Home'],
        number: ['555-555-5555']
      })]),
      address: fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      })
    }, { validator: this.forbiddenFullNameValidator });
  }


  forbiddenFullNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const firstName = control.get('firstName')?.value;
    const lastName = control.get('lastName')?.value;
    const fullName = `${ firstName } ${ lastName }`;
    const forbidden = new RegExp(/^[Mm]ickey [Mm]ouse$/).test(fullName);
    return forbidden ? { 'forbiddenFullName': { value: fullName } } : null;
  }

  forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = new RegExp(/mickey/i).test(control.value);
      return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
  }

  addPhone(): void {
    this.getPhoneNumbers.push(this.fb.group({
      alias: [''],
      number: ['']
    }));
    console.log(this.getPhoneNumbers);
  }

  get getPhoneNumbers(): FormArray {
    return this.form.get('phoneNumbers') as FormArray;
  }

  fillDefaultAddress(): void {
    this.form.patchValue({
      address: {
        street: '456 Default St',
        city: 'Defaultolopolis',
        state: 'CA',
        zip: '90000',
      }
    });
  }

  reset(): void {
    this.form.controls['firstName'].setValue('');
    this.form.controls['lastName'].setValue('');
  }

}

class CustomErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl, form: FormGroupDirective): boolean {
    return form.getError('forbiddenFullName') || control.invalid;
  }

}
