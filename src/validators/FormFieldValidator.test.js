import FormFieldValidator from './FormFieldValidator';

it('creates new instance', ()=>{
    expect(()=>new FormFieldValidator()).toThrow(Error);
    expect(()=>new FormFieldValidator(()=>true)).toThrow(Error);
    expect(()=>new FormFieldValidator(null, 'Error message')).toThrow(Error);
    expect(new FormFieldValidator(()=>true, 'Error message')).toBeInstanceOf(FormFieldValidator);
    expect(new FormFieldValidator(()=>Promise.resolve(true), 'Error message')).toBeInstanceOf(FormFieldValidator);
});
describe('validation', ()=>{
    const errorMessage = 'Error';
    const value = 4;
    const anotherValue = 17;
    const values = {anotherField: anotherValue};
    it('single value', ()=>{
        const validationFn = jest.fn().mockReturnValue(false);
        const validator = new FormFieldValidator(validationFn, errorMessage);
        expect(validator.getMessage()).toEqual(errorMessage);
        expect(validator.validate(value)).toBe(false);
        expect(validationFn).toHaveBeenCalled();
    });
    it('multiple values', ()=>{
        const validationFn = jest.fn().mockImplementation((fieldValue, formValues)=>fieldValue>formValues.anotherField);
        const validator = new FormFieldValidator(validationFn, errorMessage);
        expect(validator.getMessage()).toEqual(errorMessage);
        expect(validator.validate(value, values)).toBe(false);
        expect(validationFn).toHaveBeenCalled();
    });
});