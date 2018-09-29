import TextFormField from './TextFormField';
import FormField from './FormField';

const fieldName = 'password';
const fieldValue = '123456';
const errorMessage = 'Error message';
const createMockValues = (value)=>({[fieldName]: value});

let field;
beforeEach(()=>{
    field = new TextFormField(fieldName);
});
it('creates new instance', ()=>{
    expect(field).toBeInstanceOf(FormField);
    expect(field).toBeInstanceOf(TextFormField);
    Object.keys(TextFormField).forEach((funcName)=>{
        expect(FormField.prototype[funcName]).toBeUndefined();
    });
});
describe('minLength', ()=>{
    const minLength = 5;
    it('setup', ()=>{
        expect(field.minLength(minLength, errorMessage)).toBeInstanceOf(TextFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .minLength(minLength, errorMessage)
            .validate(createMockValues(fieldValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        const invalidValue = '123';
        expect.assertions(2);
        return field
            .minLength(minLength, errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);
            });
    });
});
describe('maxLength', ()=>{
    const maxLength=10;
    it('setup', ()=>{
        expect(field.maxLength(maxLength, errorMessage)).toBeInstanceOf(TextFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .maxLength(maxLength, errorMessage)
            .validate(createMockValues(fieldValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok - with value', ()=> {
        const invalidValue = '012345678910';
        expect.assertions(2);
        return field
            .maxLength(maxLength, errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);
            });
    });
    it('not ok - without value', ()=> {
        const invalidValue = null;
        expect.assertions(2);
        return field
            .maxLength(maxLength, errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);
            });
    });
});
describe('matchPattern', ()=>{
    const pattern = /^[0-9]+$/i;
    it('setup', ()=>{
        expect(field.matchPattern(pattern, errorMessage)).toBeInstanceOf(TextFormField);
        expect(field.getValidators()).toHaveLength(1);
        expect(()=>field.matchPattern('', errorMessage)).toThrow(Error);
        expect(()=>field.matchPattern(null, errorMessage)).toThrow(Error);
        expect(()=>field.matchPattern(undefined, errorMessage)).toThrow(Error);
        expect(()=>field.matchPattern('asdf', errorMessage)).toThrow(Error);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .matchPattern(pattern, errorMessage)
            .validate(createMockValues(fieldValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        const invalidValue = 'a1230';
        expect.assertions(2);
        return field
            .matchPattern(pattern, errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('isEmail', ()=>{
    it('setup', ()=>{
        expect(field.email(errorMessage)).toBeInstanceOf(TextFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        const validValue = 'robert.deak@gmail.com';
        expect.assertions(1);
        return field
            .email(errorMessage)
            .validate(createMockValues(validValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        const invalidValue = 'this is not email address';
        expect.assertions(2);
        return field
            .email(errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('isUrl', ()=>{
    it('setup', ()=>{
        expect(field.url(errorMessage)).toBeInstanceOf(TextFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        const validValue = 'http://www.gmail.com';
        expect.assertions(1);
        return field
            .url(errorMessage)
            .validate(createMockValues(validValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        const invalidValue = 'this is not url address';
        expect.assertions(2);
        return field
            .url(errorMessage)
            .validate(createMockValues(invalidValue))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('decorators', ()=>{
    it('uppercase', ()=>{
        expect(field.uppercase().decorateValue('asdf')).toEqual('ASDF');
    }); 
    it('uppercase', ()=>{
        expect(field.lowercase().decorateValue('ASDF')).toEqual('asdf');
    });
    it('initcap', ()=>{
        expect(field.initcap().decorateValue('aSdF')).toEqual('Asdf');
    }); 
});