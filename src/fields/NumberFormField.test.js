import FormField from './FormField';
import NumberFormField from './NumberFormField';

const fieldName = 'fieldA';
const anotherFieldName = 'fieldB';
const errorMessage = 'Error message';
const createMockValues = (firstValue, secondValue) => ({[fieldName]: firstValue, [anotherFieldName]: secondValue});
let field;
beforeEach(()=>{
    field = new NumberFormField(fieldName);
});
it('creates new instance', ()=>{
    expect(field).toBeInstanceOf(FormField);
    expect(field).toBeInstanceOf(NumberFormField);
    Object.keys(NumberFormField).forEach((funcName)=>{
        expect(FormField.prototype[funcName]).toBeUndefined();
    });
});
describe('lessThen', ()=>{
    it('setup', ()=>{
        expect(field.lessThen(10, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .lessThen(10, errorMessage)
            .validate(createMockValues(5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessThen(10, errorMessage)
            .validate(createMockValues(15))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessThenField', ()=>{
    it('setup', ()=>{
        expect(field.lessThenField(anotherFieldName, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .lessThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(5, 10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(10, 5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessOrEqualThen', ()=>{
    it('setup', ()=>{
        expect(field.lessOrEqualThen(10, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok less', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThen(10, errorMessage)
            .validate(createMockValues(5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThen(10, errorMessage)
            .validate(createMockValues(10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessOrEqualThen(10, errorMessage)
            .validate(createMockValues(15))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessOrEqualThenField', ()=>{
    it('setup', ()=>{
        expect(field.lessOrEqualThenField(anotherFieldName, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok less', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(5, 10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(10, 10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(10, 5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterThen', ()=>{
    it('setup', ()=>{
        expect(field.greaterThen(10, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .greaterThen(10, errorMessage)
            .validate(createMockValues(15))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterThen(10, errorMessage)
            .validate(createMockValues(5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterThenField', ()=>{
    it('setup', ()=>{
        expect(field.greaterThenField(anotherFieldName, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .greaterThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(10, 5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(5, 10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterOrEqualThen', ()=>{
    it('setup', ()=>{
        expect(field.greaterOrEqualThen(10, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok greater', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThen(10, errorMessage)
            .validate(createMockValues(15))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThen(10, errorMessage)
            .validate(createMockValues(10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterOrEqualThen(10, errorMessage)
            .validate(createMockValues(2))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterOrEqualThenField', ()=>{
    it('setup', ()=>{
        expect(field.greaterOrEqualThenField(anotherFieldName, errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok greater', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(15, 5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(10, 10))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues(4, 9))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('positive', ()=>{
    it('setup', ()=>{
        expect(field.positive(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .positive(anotherFieldName, errorMessage)
            .validate(createMockValues(5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok - negative', ()=> {
        expect.assertions(2);
        return field
            .positive(errorMessage)
            .validate(createMockValues(-5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
    it('not ok - zero', ()=> {
        expect.assertions(2);
        return field
            .positive(errorMessage)
            .validate(createMockValues(0))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('positiveWithZero', ()=>{
    it('setup', ()=>{
        expect(field.positiveWithZero(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .positiveWithZero(anotherFieldName, errorMessage)
            .validate(createMockValues(5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok - zero', ()=> {
        expect.assertions(1);
        return field
            .positiveWithZero(errorMessage)
            .validate(createMockValues(0))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);

            });
    });
    it('not ok - negative', ()=> {
        expect.assertions(2);
        return field
            .positiveWithZero(errorMessage)
            .validate(createMockValues(-5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('negative', ()=>{
    it('setup', ()=>{
        expect(field.negative(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .negative(anotherFieldName, errorMessage)
            .validate(createMockValues(-5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok - postiive', ()=> {
        expect.assertions(2);
        return field
            .negative(errorMessage)
            .validate(createMockValues(2))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
    it('not ok - zero', ()=> {
        expect.assertions(2);
        return field
            .negative(errorMessage)
            .validate(createMockValues(0))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('negativeWithZero', ()=>{
    it('setup', ()=>{
        expect(field.negativeWithZero(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .negativeWithZero(anotherFieldName, errorMessage)
            .validate(createMockValues(-5))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok - zero', ()=> {
        expect.assertions(1);
        return field
            .negativeWithZero(errorMessage)
            .validate(createMockValues(0))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);

            });
    });
    it('not ok - positive', ()=> {
        expect.assertions(2);
        return field
            .negativeWithZero(errorMessage)
            .validate(createMockValues(1))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('integer', ()=>{
    it('setup', ()=>{
        expect(field.integer(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', ()=>{
        expect.assertions(1);
        return field
            .integer(errorMessage)
            .validate(createMockValues(1))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('nok', ()=>{
        expect.assertions(2);
        return field
            .integer(errorMessage)
            .validate(createMockValues('1.0'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);
            });
    });
});
describe('decimal', ()=>{
    it('setup', ()=>{
        expect(field.decimal(errorMessage)).toBeInstanceOf(NumberFormField);
        expect(field.getValidators()).toHaveLength(1);
    });
    it('ok', ()=>{
        expect.assertions(1);
        return field
            .decimal(errorMessage)
            .validate(createMockValues('-1.0'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('nok', ()=>{
        expect.assertions(2);
        return field
            .decimal(errorMessage)
            .validate(createMockValues(1))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);
            });
    });
});