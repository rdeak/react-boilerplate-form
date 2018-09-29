import FormField from './FormField';
import DateFormField from './DateFormField';
import {parseDate} from 'yadate-converter';

const fieldName = 'fieldA';
const anotherFieldName = 'fieldB';
const errorMessage = 'Error message';
const createMockValues = (firstValue, secondValue) => ({[fieldName]: firstValue, [anotherFieldName]: secondValue});
let field;
beforeEach(()=>{
    field = new DateFormField(fieldName, 'DD.MM.YYYY', errorMessage);
});
it('creates new instance', ()=>{
    expect(field).toBeInstanceOf(FormField);
    expect(field).toBeInstanceOf(DateFormField);
    expect(new DateFormField(fieldName, 'D.M.YYYY', errorMessage)).toBeInstanceOf(DateFormField);
    Object.keys(DateFormField).forEach((funcName)=>{
        expect(FormField.prototype[funcName]).toBeUndefined();
    });
    expect(field.getValidators()).toHaveLength(1);
    expect(()=>new DateFormField(fieldName, null, errorMessage)).toThrow(Error);
    expect(()=>new DateFormField(fieldName, '', errorMessage)).toThrow(Error);
    expect(()=>new DateFormField(fieldName, [], errorMessage)).toThrow(Error);
    expect(()=>new DateFormField(fieldName, {}, errorMessage)).toThrow(Error);
});
describe('lessThen', ()=>{
    it('setup', ()=>{
        expect(()=>field.lessThen('12.10.2018', errorMessage)).toThrow(Error);
        expect(field.lessThen(parseDate('12.10.2018'), errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .lessThen(parseDate('15.08.2018'), errorMessage)
            .validate(createMockValues('15.07.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessThen(parseDate('12.01.2018'), errorMessage)
            .validate(createMockValues('13.01.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessThenField', ()=>{
    it('setup', ()=>{
        expect(field.lessThenField(anotherFieldName, errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .lessThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('01.03.2018', '08.04.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('08.04.2018', '01.03.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessOrEqualThen', ()=>{
    it('setup', ()=>{
        expect(()=>field.lessOrEqualThen('08.08.2018', errorMessage)).toThrow(Error);
        expect(field.lessOrEqualThen(parseDate('08.08.2018'), errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok less', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThen(parseDate('29.09.2018'), errorMessage)
            .validate(createMockValues('22.08.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThen(parseDate('22.07.2018'), errorMessage)
            .validate(createMockValues('22.07.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessOrEqualThen(parseDate('23.06.2018'), errorMessage)
            .validate(createMockValues('11.09.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('lessOrEqualThenField', ()=>{
    it('setup', ()=>{
        expect(field.lessOrEqualThenField(anotherFieldName, errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok less', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('09.02.2018', '20.02.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('06.11.2018', '06.11.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .lessOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('06.11.2018', '05.11.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterThen', ()=>{
    it('setup', ()=>{
        expect(()=>field.greaterThen('31.08.2018', errorMessage)).toThrow(Error);
        expect(field.greaterThen(parseDate('31.08.2018'), errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .greaterThen(parseDate('28.12.2018'), errorMessage)
            .validate(createMockValues('29.12.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterThen(parseDate('25.12.2018'), errorMessage)
            .validate(createMockValues('13.01.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterThenField', ()=>{
    it('setup', ()=>{
        expect(field.greaterThenField(anotherFieldName, errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok', () => {
        expect.assertions(1);
        return field
            .greaterThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('01.10.2018', '24.01.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('08.10.2018', '12.10.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterOrEqualThen', ()=>{
    it('setup', ()=>{
        expect(()=>field.greaterOrEqualThen('30.06.2018', errorMessage)).toThrow(Error);
        expect(field.greaterOrEqualThen(parseDate('30.06.2018'), errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok greater', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThen(parseDate('10.06.2018'), errorMessage)
            .validate(createMockValues('19.06.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThen(parseDate('10.06.2018'), errorMessage)
            .validate(createMockValues('10.06.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterOrEqualThen(parseDate('11.06.2018'), errorMessage)
            .validate(createMockValues('10.06.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});
describe('greaterOrEqualThenField', ()=>{
    it('setup', ()=>{
        expect(field.greaterOrEqualThenField(anotherFieldName, errorMessage)).toBeInstanceOf(DateFormField);
        expect(field.getValidators()).toHaveLength(2);
    });
    it('ok greater', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('30.05.2018', '04.05.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('ok equal', () => {
        expect.assertions(1);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('30.05.2018', '30.05.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(0);
            });
    });
    it('not ok', ()=> {
        expect.assertions(2);
        return field
            .greaterOrEqualThenField(anotherFieldName, errorMessage)
            .validate(createMockValues('30.05.2018', '03.06.2018'))
            .then( errorMessages => {
                expect(errorMessages).toHaveLength(1);
                expect(errorMessages).toEqual([errorMessage]);

            });
    });
});