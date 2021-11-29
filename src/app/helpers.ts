import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DEFAULT_COIN, SECONDS_IN_YEAR } from './constants';

export const getMoneyPerSecond = (money: number, coin?: string): number => {
  if (!coin) {
    return money / SECONDS_IN_YEAR;
  }

  return 0;
};

export const calculateMoneySince = (
  moneyPerSecond: number,
  seconds: number,
  factor: number
): number => {
  return Math.round(moneyPerSecond * seconds * factor);
};

export const _filter = (name: string, target: Array<any>): Array<any> => {
  const filterValue = name.toLowerCase();
  return target.filter((option) =>
    option.name.toLowerCase().includes(filterValue)
  );
};

export const _filterCurrencies = (name: string, target: Array<any>): Array<any> => {
  const filterValue = name.toLowerCase();
  return target.filter((option) =>
    option.displayName.toLowerCase().includes(filterValue))
};



export const checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
  const pass: string | null = group.get('password')?.value;
  const passRe: string | null = group.get('passwordRe')?.value;

  return pass === passRe ? null : { notSame: true };
}