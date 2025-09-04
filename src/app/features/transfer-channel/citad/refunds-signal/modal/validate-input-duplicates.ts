import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbiddenChars = /[~!@#$%^&*()\-_=+\[\]{}\\|;:'",<.>\/?]`/;
      const char10orChar13 = /[\x0A\x0D]/; // Block Line Feed (char 10) and Carriage Return (char 13)
  
      if (forbiddenChars.test(control.value) || char10orChar13.test(control.value)) {
        return { 'specialCharsForbidden': { value: control.value } };
      }
      return null;
    };
  }
