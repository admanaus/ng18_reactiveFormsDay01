import { V } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-contact-form',
  templateUrl: './customer-contact-form.component.html',
  styleUrl: './customer-contact-form.component.css'
})
export class CustomerContactFormComponent {

  form: FormGroup;
  fb: FormBuilder = new FormBuilder;  // we'll want to be able to access this later outside of the controller

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      firstName: ['Sweet', Validators.required],
      lastName: ['Tooth', Validators.required],
      phoneNumbers: fb.array([fb.group({
        alias: ['Home'],
        number: ['555-555-5555']
      })]),
      address: fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: ['']
      })
    });
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
