import FormValidator from './FormValidator';

it('creates new instance', ()=>{
    expect(()=>new FormValidator()).toThrow(Error);
    expect(()=>new FormValidator(()=>true)).toThrow(Error);
    expect(()=>new FormValidator(null, 'Error message')).toThrow(Error);
    expect(new FormValidator(()=>true, 'Error message')).toBeInstanceOf(FormValidator);
    expect(new FormValidator(()=>Promise.resolve(true), 'Error message')).toBeInstanceOf(FormValidator);
});
it('validation', ()=>{
    const errorMessage = 'Error';
    const values = {fieldA: 1};
    const validationFn = jest.fn().mockReturnValue(false);
    const validator = new FormValidator(validationFn, errorMessage);
    expect(validator.getMessage()).toEqual(errorMessage);
    expect(validator.validate(values)).toBe(false);
    expect(validationFn).toHaveBeenCalled();
});