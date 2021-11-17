import { Validator } from '../../utilities/validator';

describe('Test Validator', () => {
  it('should return false empty strings', () => {
    expect(Validator.hasValue('')).toBeFalse();
  });
  it('should return false for only spaces', () => {
    expect(Validator.hasValue('  ')).toBeFalse();
  });
  it('should return true if at least there is one char', () => {
    expect(Validator.hasValue('w  ')).toBeTrue();
  });

  it('should return false', () => {
    expect(Validator.isNumber('w10')).toBeFalse();
  });

  it('should return false if you did not provide anything', () => {
    expect(Validator.isNumber('')).toBeFalse();
  });

  it('should return true if you provide number', () => {
    expect(Validator.isNumber('10')).toBeTrue();
  });

  it('should return true if you provide Negative number', () => {
    expect(Validator.isPositiveNumber('10')).toBeTrue();
  });

  it('should return false if you provide Negative number', () => {
    expect(Validator.isPositiveNumber('-10')).toBeFalse();
  });

  it('should return false if you provide non numeric ', () => {
    expect(Validator.isPositiveNumber('d-10')).toBeFalse();
  });
});
