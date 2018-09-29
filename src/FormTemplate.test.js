import FormTemplate from './FormTemplate';
import FormField from './fields/FormField';
import FormFieldRules from './FormFieldRules';
import TemporaryStorage from './storages/TemporaryStorage';
import { buildNewState } from './FormState';
import FormRules from './FormRules';
import FormValidator from './validators/FormValidator';

const fieldOkSync = new FormField('fieldOkSync')
    .addValidator(()=>true, 'ok sync');
const fieldNokSync = new FormField('fieldNokSync')
    .addValidator(()=>true, 'ok sync').
    addValidator(()=>false, 'not ok sync');
const fieldOkAsync = new FormField('fieldOkAsync')
    .addValidator(()=>Promise.resolve(true), 'ok async');
const fieldNOkAsync = new FormField('fieldNOkAsync')
    .addValidator(()=>Promise.resolve(true), 'ok async')
    .addValidator(()=>Promise.resolve(false), 'not ok async');
const fieldMixOk = new FormField('fieldMixOk')
    .addValidator(()=>true, 'ok sync')
    .addValidator(()=>Promise.resolve(true), 'ok async')
    .addValidator(()=>true, 'ok sync')
    .addValidator(()=>Promise.resolve(true), 'ok async');
const fieldMixNOk = new FormField('fieldMixNOk')
    .addValidator(()=>true, 'ok sync')
    .addValidator(()=>Promise.resolve(true), 'ok async')
    .addValidator(()=>Promise.resolve(false), 'not ok mix')
    .addValidator(()=>false, 'not ok mix sync');
const fieldName = 'first_name';
const fieldValue = 'Kristina';
const fieldError = 'error message';
const field = new FormField(fieldName);
const fieldRules = new FormFieldRules(field);
const filledFieldEventMock = {target: {name: fieldName, value: fieldValue}};
const emptyFieldEventMock = {target: {name: fieldName, value: ''}};
let storage;
let template;

beforeEach(()=>{
    storage = new TemporaryStorage();
    template = new FormTemplate(storage.push, storage.pull);
});
it('creates new instance', ()=>{
    expect(()=>new FormTemplate()).toThrow(Error);
    expect(()=>new FormTemplate({}, jest.fn())).toThrow(Error);
    expect(()=>new FormTemplate(jest.fn(), [])).toThrow(Error);
    expect(new FormTemplate(jest.fn(), jest.fn())).toBeInstanceOf(FormTemplate);
});
it('getValues', ()=>{
    const values = {[fieldName]: '1'};
    storage.push(buildNewState(fieldRules, values));
    expect(template.getValues()).toEqual(values);
});
it('getActiveProfiles', ()=>{
    const activeProfiles = ['Profile A', 'Profile B'];
    storage.push({profiles: activeProfiles});
    expect(template.getActiveProfiles()).toEqual(activeProfiles);
    expect(template.getActiveProfiles()===activeProfiles).toBe(false);
});
it('field manipulation', ()=>{
    storage.push(buildNewState(fieldRules, {}));
    expect(template.getField(fieldName)).toBeDefined();
    expect(template.hasField(fieldName)).toBe(true);
});
it('onFieldBlur', ()=>{
    const validateFieldSpy = jest.spyOn(template, 'validateField');
    storage.push(buildNewState(fieldRules, {[fieldName]: fieldValue}));
    template.onFieldBlur(filledFieldEventMock);
    expect(validateFieldSpy).toHaveBeenCalledWith(fieldName);
    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
    validateFieldSpy.mockClear();
});
describe('onFieldChange', ()=>{
    const eventMockCheck = {target: {type: 'checkbox', checked: true, name: fieldName, value: fieldValue}};
    beforeEach(()=>{
        storage.push(buildNewState(fieldRules, {[fieldName]: fieldValue}));
    });
    it('set new value - not checkbox', ()=>{
        template.onFieldChange(filledFieldEventMock);
        expect(storage.pull('values')[fieldName]).toBe(fieldValue);
    });
    it('set new value - checkbox', ()=>{
        template.onFieldChange(eventMockCheck);
        expect(storage.pull('values')[fieldName]).toBe(true);
    });
    it('error on nonexistent field', ()=>{
        const eventMock = {target: {name: 'nonexistent', value: fieldValue}};
        expect(()=>template.onFieldChange(eventMock)).toThrow(Error);
    });
});
describe('handlers', ()=>{
    beforeEach(()=>{
        storage.push(buildNewState(fieldRules, {[fieldName]: fieldValue}));
    });
    it('getInputHandlers', ()=>{
        const handler = template.getInputHandlers(fieldName);
        expect(Object.keys(handler)).toEqual(['value', 'onChange', 'onBlur']);
        expect(handler.value).toEqual(fieldValue);
    });
    it('getRadioHandlers',()=>{
        const handler = template.getRadioHandlers(fieldName, fieldValue);
        expect(Object.keys(handler)).toEqual(['checked', 'onChange']);
        expect(handler.checked).toEqual(true);
    });
});

it('ignoreValue', ()=>{
    const fieldA = new FormField('A');
    const fieldB = new FormField('B').ignoreValue(true);
    const fieldRules = new FormFieldRules(fieldA, fieldB);
    storage.push(buildNewState(fieldRules, {'A': '', 'B': '0'}));
    expect(template.getValues()).toEqual({'A': ''});
});

it('validateField', ()=>{
    const fieldRules = new FormFieldRules(
        fieldOkSync, fieldNokSync, fieldOkAsync, fieldNOkAsync, fieldMixOk, fieldMixNOk
    );
    storage.push(buildNewState(fieldRules, {}));
    expect.assertions(9);
    return Promise.all([
        template.validateField('fieldOkSync'),
        template.validateField('fieldNokSync'),
        template.validateField('fieldOkAsync'),
        template.validateField('fieldNOkAsync'),
        template.validateField('fieldMixOk'),
        template.validateField('fieldMixNOk')
    ])
        .then(result => {
            expect(template.getFieldErrors()).toEqual({
                'fieldOkSync': [],
                'fieldNokSync': ['not ok sync'],
                'fieldOkAsync': [],
                'fieldNOkAsync': ['not ok async'],
                'fieldMixOk': [],
                'fieldMixNOk': ['not ok mix'],
            });
            expect(result).toEqual([true, false, true, false, true, false]);
            expect(template.isValid()).toBe(false);
            expect(template.isValid('fieldOkSync')).toBe(true);
            expect(template.isValid('fieldNokSync')).toBe(false);
            expect(template.isValid('fieldOkAsync')).toBe(true);
            expect(template.isValid('fieldNOkAsync')).toBe(false);
            expect(template.isValid('fieldMixOk')).toBe(true);
            expect(template.isValid('fieldMixNOk')).toBe(false);
        });
});

describe('validateFields', ()=>{
    it('not ok', ()=>{
        const fieldRules = new FormFieldRules(
            fieldOkSync, fieldNokSync, fieldOkAsync, fieldNOkAsync, fieldMixOk, fieldMixNOk
        );
        storage.push(buildNewState(fieldRules, {}));    
        expect.assertions(9);
        return template.validateFields()
            .then(
                isValid => {
                    expect(isValid).toBe(false);
                    expect(template.getFieldErrors()).toEqual({
                        'fieldOkSync': [],
                        'fieldNokSync': ['not ok sync'],
                        'fieldOkAsync': [],
                        'fieldNOkAsync': ['not ok async'],
                        'fieldMixOk': [],
                        'fieldMixNOk': ['not ok mix'],
                    });
                    expect(template.isValid()).toBe(false);
                    expect(template.isValid('fieldOkSync')).toBe(true);
                    expect(template.isValid('fieldNokSync')).toBe(false);
                    expect(template.isValid('fieldOkAsync')).toBe(true);
                    expect(template.isValid('fieldNOkAsync')).toBe(false);
                    expect(template.isValid('fieldMixOk')).toBe(true);
                    expect(template.isValid('fieldMixNOk')).toBe(false);
                }
            );
    });
    it('ok', ()=>{
        const fieldRules = new FormFieldRules(
            fieldOkSync, fieldOkAsync, fieldMixOk
        );
        storage.push(buildNewState(fieldRules, {}));
        expect.assertions(6);
        return template.validateFields()
            .then(
                isValid => {
                    expect(isValid).toBe(true);
                    expect(template.getFieldErrors()).toEqual({
                        'fieldOkSync': [],
                        'fieldOkAsync': [],
                        'fieldMixOk': [],
                    });
                    expect(template.isValid()).toBe(true);
                    expect(template.isValid('fieldOkSync')).toBe(true);
                    expect(template.isValid('fieldOkAsync')).toBe(true);
                    expect(template.isValid('fieldMixOk')).toBe(true);
                }
            );
    });
});

describe('validateForm', ()=>{
    beforeEach(()=>{
        storage.push(buildNewState(new FormFieldRules(), {}));
    });
    it('ok', ()=> {
        const formRules = new FormRules(
            new FormValidator(()=>true, 'ok'),
            new FormValidator(()=>Promise.resolve(true), 'ok')
        );
        storage.push({formRules});
        expect.assertions(3);
        return template.validateForm()
            .then(
                isValid => {
                    expect(isValid).toBe(true);
                    expect(template.isValid()).toBe(true);
                    expect(template.getFormErrors()).toEqual([]);
                }
            );
    });
    it('not ok', ()=>{
        const formRules = new FormRules(
            new FormValidator(()=>Promise.resolve(false), 'not ok async'),
            new FormValidator(()=>false, 'not ok sync'),
            new FormValidator(()=>{throw new Error('error');}, 'not ok error')
        );
        storage.push({formRules});
        expect.assertions(3);
        return template.validateForm()
            .then(
                isValid => {
                    expect(isValid).toBe(false);
                    expect(template.isValid()).toBe(false);
                    expect(template.getFormErrors()).toEqual(['not ok async']);
                }
            );
    });
});

describe('submit', ()=>{
    beforeEach(()=>{
        const state = buildNewState(fieldRules, {[fieldName]: fieldValue});
        storage.push(state);
    });
    it('without processor function', ()=>{
        expect(()=>template.submit()).toThrow(Error);
    });
    it('ok', () => {
        const formProcessorMock = jest.fn();    
        expect.assertions(7);
        return template.submit(formProcessorMock)
            .then( 
                ()=>{
                    expect(template.isValid()).toBe(true);
                    expect(template.isInvalid()).toBe(false);
                    expect(template.getFormErrors()).toHaveLength(0);
                    expect(template.getFieldErrors()[fieldName]).toHaveLength(0);
                    expect(template.isBusy()).toBe(false);
                    expect(formProcessorMock).toHaveBeenCalledTimes(1);
                    expect(formProcessorMock).toHaveBeenCalledWith(template.getValues());
                }
            );
    });
    it('not ok', () => {
        const formProcessorMock = jest.fn();    
        const fieldRules = new FormFieldRules(new FormField('another_field'), field.clone().required(fieldError));
        storage.push(buildNewState(fieldRules, {}));
        expect.assertions(5);
        return template.submit(formProcessorMock)
            .then( 
                () => {
                    expect(template.isInvalid()).toBe(true);
                    expect(template.getFormErrors()).toHaveLength(0);
                    expect(template.getFieldErrors()[fieldName]).toEqual([fieldError]);
                    expect(formProcessorMock).not.toHaveBeenCalled();
                    expect(template.isBusy()).toBe(false);
                }
            );
    });
    it('error on async form proccessing ', ()=>{
        const formProcessorMock = jest.fn().mockImplementation(
            ()=>Promise.reject(fieldError)
        );   
        storage.push(buildNewState(fieldRules, {}));
        expect.assertions(3);
        return template.submit(formProcessorMock)
            .then(
                () => {
                    expect(formProcessorMock).toHaveBeenCalledTimes(1);
                    expect(template.isInvalid()).toBe(true);
                    expect(template.getFormErrors()).toEqual([fieldError]);
                }
            );
    });
    it('error on async form proccessing ', ()=>{
        const formProcessorMock = jest.fn().mockImplementation(
            ()=>{throw new Error(fieldError);}
        );
        storage.push(buildNewState(fieldRules, {}));
        expect.assertions(3);
        return template.submit(formProcessorMock)
            .then(
                () => {
                    expect(formProcessorMock).toHaveBeenCalledTimes(1);
                    expect(template.isInvalid()).toBe(true);
                    expect(template.getFormErrors()).toEqual([fieldError]);
                }
            );
    });
});

it('reset', ()=>{   
    const fieldRules = new FormFieldRules(
        new FormField('field_b').required(fieldError), 
        field
    );
    const formRules = new FormRules(new FormValidator(()=>false, fieldError));
    const state = buildNewState(fieldRules, {[fieldName]: fieldValue}, null, formRules);
    storage.push(state);    
    template.onFieldChange(filledFieldEventMock);
    expect.assertions(1);
    return template.validate()
        .then(
            () => {
                template.reset();
                expect(storage.getRef()).toEqual(state);
            }
        );
});
it('isValid and isInvalid', ()=>{
    const fieldWithValidator = field.clone().required(fieldError);
    const fieldRules = new FormFieldRules(fieldWithValidator);
    storage.push(buildNewState(fieldRules, {[fieldName]: fieldValue}));
    expect.assertions(12);
    expect(template.isValid()).toBe(true);
    expect(template.isInvalid()).toBe(false);
    expect(template.isValid(fieldName)).toBe(true);
    expect(template.isInvalid(fieldName)).toBe(false);
    template.onFieldChange(emptyFieldEventMock);
    return template.validate().then(
        ()=>{
            expect(template.isValid()).toBe(false);
            expect(template.isInvalid()).toBe(true);
            expect(template.isValid(fieldName)).toBe(false);
            expect(template.isInvalid(fieldName)).toBe(true);

            template.reset();
            expect(template.isValid()).toBe(true);
            expect(template.isInvalid()).toBe(false);
            expect(template.isValid(fieldName)).toBe(true);
            expect(template.isInvalid(fieldName)).toBe(false);
        }
    );
});
it('dirty and pristine', ()=>{
    storage.push(buildNewState(fieldRules, {[fieldName]: fieldValue}));
    expect(template.isPristine()).toBe(true);
    expect(template.isDirty()).toBe(false);
    expect(template.isPristine(fieldName)).toBe(true);
    expect(template.isDirty(fieldName)).toBe(false);

    template.onFieldChange(emptyFieldEventMock);
    expect(template.isPristine()).toBe(false);
    expect(template.isDirty()).toBe(true);
    expect(template.isPristine(fieldName)).toBe(false);
    expect(template.isDirty(fieldName)).toBe(true);

    template.reset();
    expect(template.isPristine()).toBe(true);
    expect(template.isDirty()).toBe(false);
    expect(template.isPristine(fieldName)).toBe(true);
    expect(template.isDirty(fieldName)).toBe(false);
});