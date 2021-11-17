export class Validator {
  static hasValue(value: string): boolean {
    return !!(value ? value : '').trim();
  }

  static isNumber(value: string): boolean {
    return Validator.hasValue(value) && !isNaN(parseInt(value));
  }

  static isPositiveNumber(value: string): boolean {
    return Validator.isNumber(value) && parseInt(value) > 0;
  }
}
