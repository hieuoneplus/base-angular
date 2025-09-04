import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function logicValidator(isExpandedFn: boolean): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const minAmount = Number(group.get('minAmount')?.value);
    const maxAmount = Number(group.get('maxAmount')?.value);
    const fragmentAmount = Number(group.get('fragmentAmount')?.value);
    const fragmentMaxAmount = Number(group.get('fragmentMaxAmount')?.value);
    let invalidMinAmount = false,
      invalidMaxAmount = false,
      invalidFragmentAmount = false,
      invalidFragmentMaxAmount = false;
    const isValidInteger = (val: number) => Number.isInteger(val) && val != 0;

    if (
      (!isValidInteger(minAmount) ||
        !isValidInteger(maxAmount) ||
        maxAmount <= minAmount) &&
      maxAmount != 0 &&
      minAmount != 0
    ) {
      invalidMinAmount = true;
      invalidMaxAmount = true;
    }

    if (isExpandedFn) {
      if (
        (!isValidInteger(fragmentAmount) ||
          !isValidInteger(fragmentMaxAmount)) &&
        fragmentAmount != 0 &&
        fragmentMaxAmount != 0
      ) {
        (invalidFragmentAmount = true), (invalidFragmentMaxAmount = true);
      }
      if (
        fragmentAmount <= minAmount &&
        minAmount != 0 &&
        fragmentAmount != 0
      ) {
        (invalidFragmentAmount = true), (invalidMinAmount = true);
      }
      if (
        fragmentAmount >= maxAmount &&
        maxAmount != 0 &&
        fragmentAmount != 0
      ) {
        (invalidFragmentAmount = true), (invalidMaxAmount = true);
      }
      if (
        fragmentMaxAmount <= fragmentAmount &&
        fragmentMaxAmount != 0 &&
        fragmentAmount != 0
      ) {
        (invalidFragmentAmount = true), (invalidFragmentMaxAmount = true);
      }
      if (
        fragmentMaxAmount <= maxAmount &&
        maxAmount != 0 &&
        fragmentMaxAmount != 0
      ) {
        (invalidMaxAmount = true), (invalidFragmentMaxAmount = true);
      }
      if (
        maxAmount <= fragmentAmount + minAmount &&
        maxAmount != 0 &&
        minAmount != 0 &&
        fragmentAmount != 0
      ) {
        (invalidFragmentAmount = true),
          (invalidMinAmount = true),
          (invalidMaxAmount = true);
      }
    }
    console.log("abc",  invalidFragmentAmount ,
      invalidMinAmount ,
      invalidMaxAmount ,
      invalidFragmentMaxAmount,isExpandedFn)
    if (
      invalidFragmentAmount ||
      invalidMinAmount ||
      invalidMaxAmount ||
      invalidFragmentMaxAmount
    ) {
      return {
        invalidFragmentAmount,
        invalidMinAmount,
        invalidMaxAmount,
        invalidFragmentMaxAmount,
      };
    }

    return null;
  };
}
