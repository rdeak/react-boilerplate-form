import FormField from './FormField';
import FormFieldValidator from '../validators/FormFieldValidator';
import FormFieldOption from './FormFieldOption';
        
const fieldName = 'title';
const errorMessage = 'Error';
const validationValue = 'Random value';
const values = {[fieldName]: validationValue};
let field;
beforeEach(()=>{
    field = new FormField(fieldName);
});

it('creates new instance', ()=>{
    expect(()=>new FormField()).toThrow(Error);
    expect(()=>new FormField('$')).toThrow(Error);
    expect(()=>new FormField('_')).toThrow(Error);
    expect(()=>new FormField('1')).toThrow(Error);
    expect(()=>new FormField('.')).toThrow(Error);
    expect(new FormField(fieldName)).toBeInstanceOf(FormField);
    expect(field.getName()).toEqual(fieldName);
});
it('clone', ()=>{
    const field = new FormField('A')
        .setPlaceholder('A')
        .addValidator(jest.fn(), 'error message')
        .required('required message')
        .addDecorator(jest.fn())
        .addOption('l', 1)
        .setMetadata({'k1': '2'})
        .stopValidationOnFirstFail(true)
        .ignoreValue(true);
    
    const clonedField = field.clone();
    expect(clonedField).toBeInstanceOf(FormField);
    expect(clonedField===field).toBe(false);
    expect(clonedField.getPlaceholder()).toEqual(field.getPlaceholder());
    expect(clonedField.getValidators()).toHaveLength(field.getValidators().length);
    expect(clonedField.getDecorators()).toEqual(field.getDecorators());
    expect(clonedField.getMetadata()).toEqual(field.getMetadata());
    expect(clonedField.isRequired()).toEqual(field.isRequired());
    expect(clonedField.isValueIgnored()).toEqual(field.isValueIgnored());
});
describe('validation', ()=>{
    it('all values must be passed as argument', ()=>{
        expect(()=>field.validate()).toThrow(Error);
        expect(()=>field.validate(null)).toThrow(Error);
        expect(()=>field.validate(undefined)).toThrow(Error);
        expect(()=>field.validate(1)).toThrow(Error);
        expect(()=>field.validate([1])).toThrow(Error);
    });
    it('success', ()=>{
        const validationFn = jest.fn().mockReturnValue(true);
        expect.assertions(2);
        return field
            .addValidator(validationFn, errorMessage)
            .validate(values)
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(0);
                }
            );
    });
    it('fail', ()=>{
        const validationFn = jest.fn().mockReturnValue(false);
        expect.assertions(3);
        return field
            .addValidator(validationFn, errorMessage)
            .validate(values)
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toMatchObject([errorMessage]);
                }
            );
        
    });
    it('fail then success', ()=>{
        const validationFn = jest.fn()
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);
        expect.assertions(5);
        return field
            .addValidator(validationFn, errorMessage)
            .validate(values)
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toMatchObject([errorMessage]);
                }
            )
            .then(()=>field.validate(values))
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(0);
                }
            );
    });
    it('success then fail', ()=>{
        const validationFn = jest.fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        expect.assertions(5);
        return field
            .addValidator(validationFn, errorMessage)
            .validate(values)
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(0);
                }
            )
            .then(()=>field.validate(values))
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toMatchObject([errorMessage]);
                }
            );
    });
    it('mix async and sync validators', ()=>{
        const errorMessageSync = 'error sync';
        const errorMessageAsync = 'error async';
        const syncValidationOk = jest.fn().mockReturnValue(true);
        const syncValidationNok = jest.fn().mockReturnValue(false);
        const aysncValidaitonOk = jest.fn().mockImplementation(()=> new Promise(resolve => resolve(true)));
        const aysncValidaitonNok = jest.fn().mockImplementation(()=>new Promise(resolve => resolve(false)));
        expect.assertions(3);
        return field
            .addValidator(syncValidationOk, errorMessageSync)
            .addValidator(aysncValidaitonOk, errorMessageAsync)
            .addValidator(aysncValidaitonNok, errorMessageAsync)
            .addValidator(syncValidationNok, errorMessageSync)
            .validate(values)
            .then(
                (errors)=>{
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toEqual([errorMessageAsync]);
                });
    });
    it('one validator fail with unexpected error', ()=>{
        const errorMessage = 'regular error message';
        const unexpectedErrorMessage = 'unexpected error message';
        const syncValidationOk = jest.fn().mockReturnValue(true);
        const syncValidationNok = jest.fn().mockReturnValue(false);
        const syncValidationErr = jest.fn().mockImplementation(()=>{throw new Error(unexpectedErrorMessage);});
        const asyncValidationOk = jest.fn().mockImplementation(() => Promise.resolve(true));
        const asyncValidationNok = jest.fn().mockImplementation(() => Promise.resolve(false));
        const asyncValidationErr = jest.fn().mockImplementation(() => Promise.reject(unexpectedErrorMessage));
        field
            .addValidator(syncValidationErr, unexpectedErrorMessage)
            .addValidator(syncValidationOk, errorMessage)
            .addValidator(syncValidationNok, errorMessage)
            .addValidator(asyncValidationOk, errorMessage)
            .addValidator(asyncValidationNok, errorMessage)
            .addValidator(asyncValidationErr, unexpectedErrorMessage)
            .stopValidationOnFirstFail(false);
        expect.assertions(3);
        return field.validate(values).then(
            (errors)=>{
                expect(errors).toBeInstanceOf(Array);
                expect(errors).toHaveLength(4);
                expect(errors).toEqual([unexpectedErrorMessage, errorMessage, errorMessage, unexpectedErrorMessage]);
            }
        );
    });
    it('stopValidationOnFirstFail receive only boolean', ()=>{
        expect(()=>field.stopValidationOnFirstFail()).toThrow(Error);
    });
    describe('required', ()=>{
        it('ok', () => {
            expect.assertions(2);
            return field
                .required(errorMessage)
                .validate(values)
                .then(
                    isValid => {
                        expect(isValid).toEqual([]);
                        expect(field.isRequired()).toBe(true);
                    }
                );
        });
        it('not ok', () => {
            expect.assertions(2);
            return field
                .required(errorMessage)
                .validate({[fieldName]: ''})
                .then(
                    isValid => {
                        expect(isValid).toEqual([errorMessage]);
                        expect(field.isRequired()).toBe(true);
                    }
                );
        });
        it('by default field is not required', ()=>{
            expect(field.isRequired()).toBe(false);
        });
    });
    describe('hasEqualValue', ()=>{
        const anotherFieldName = 'another_field';
        it('setup', ()=>{
            expect(field.hasEqualValueAs(anotherFieldName, errorMessage)).toBeInstanceOf(FormField);
            expect(field.getValidators()).toHaveLength(1);
        });
        it('ok', () => {
            const values = {[fieldName]: 1, [anotherFieldName]: 1};
            expect.assertions(1);
            return field
                .hasEqualValueAs(anotherFieldName, errorMessage)
                .validate(values)
                .then( errorMessages => {
                    expect(errorMessages).toHaveLength(0);
                });
        });
        it('not ok', ()=> {
            const values = {[fieldName]: 1, [anotherFieldName]: 2};
            expect.assertions(2);
            return field
                .hasEqualValueAs(anotherFieldName, errorMessage)
                .validate(values)
                .then( errorMessages => {
                    expect(errorMessages).toHaveLength(1);
                    expect(errorMessages).toEqual([errorMessage]);
                });
        });
    });
});
it('validator', ()=>{
    const validationFn = jest.fn().mockReturnValue(true);
    expect(field.addValidator(validationFn, errorMessage)).toBeInstanceOf(FormField);
    expect(field.getValidators()).toHaveLength(1);
    expect(field.getValidators()[0]).toBeInstanceOf(FormFieldValidator);
    expect(field.validate(values)).toBeInstanceOf(Promise);
});
it('addValidators', ()=>{
    expect(()=>field.addValidators()).toThrow(Error);
    expect(()=>field.addValidators([1])).toThrow(Error);
});
it('option', ()=>{
    expect(()=>field.addOptions()).toThrow(Error);
    expect(()=>field.addOptions(1)).toThrow(Error);
    expect(()=>field.addOptions([1])).toThrow(Error);
    const label = 'Label';
    const value = 'Value';
    expect(field.addOption(label, value)).toBeInstanceOf(FormField);
    expect(field.getOptions()).toBeInstanceOf(Array);
    expect(field.getOptions()).toHaveLength(1);
    expect(field.getOptions()[0]).toBeInstanceOf(FormFieldOption);
    expect(field.getOptions()[0].getLabel()).toEqual(label);
    expect(field.getOptions()[0].getValue()).toEqual(value);
});
it('placeholder', ()=>{
    const field = new FormField(fieldName);
    const placeholder = 'a new book title';
    expect(field.setPlaceholder(placeholder)).toBeInstanceOf(FormField);
    expect(field.getPlaceholder()).toEqual(placeholder);
});
it('metadata', ()=>{
    expect(()=>field.setMetadata(1)).toThrow(Error);
    expect(()=>field.setMetadata()).toThrow(Error);
    const metadata = {foo: 'bar'};
    expect(field.setMetadata(metadata)).toBeInstanceOf(FormField);
    expect(field.getMetadata()).toEqual(metadata);
    expect(field.getMetadata()===metadata).toBe(false);
});
it('value ignore', ()=>{
    expect(()=>field.ignoreValue(1)).toThrow(Error);
    expect(field.ignoreValue(true)).toBeInstanceOf(FormField);
    expect(field.isValueIgnored()).toBe(true);
    expect(field.ignoreValue(false).isValueIgnored()).toBe(false);
});
describe('decorators', ()=>{
    it('invalid', ()=>{
        expect(()=>field.addDecorator()).toThrow(Error);
        expect(()=>field.addDecorator(1)).toThrow(Error);
        expect(()=>field.addDecorators(1)).toThrow(Error);
        expect(()=>field.addDecorators([1])).toThrow(Error);
    });
    it('empty', ()=>{
        expect(field.decorateValue('asdf')).toEqual('asdf');
    });
    it('custom', ()=>{
        expect(
            field
                .addDecorator(value=>'xxx'+value)
                .decorateValue('asdf')
        ).toEqual('xxxasdf');
    });
    it('multiple', ()=>{
        expect(field
            .addDecorator(value=>'xxx'+value)
            .addDecorator(value=>value+'yyy')
            .decorateValue('asdf')
        ).toEqual('xxxasdfyyy');
    });
});