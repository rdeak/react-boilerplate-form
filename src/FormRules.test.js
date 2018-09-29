import FormRules from './FormRules';
import FormValidator from './validators/FormValidator';

const errorMessage = 'on error message';
const validatorOk = new FormValidator(jest.fn().mockReturnValue(true), errorMessage);
const validatorNok = new FormValidator(jest.fn().mockReturnValue(false), errorMessage);
const validatorErr = new FormValidator(jest.fn().mockImplementation(()=>{throw new Error(errorMessage);}), errorMessage);
const validatorErrAsync = new FormValidator(jest.fn().mockImplementation(()=>Promise.reject(errorMessage)), errorMessage);

it('creates new instance', ()=>{
    expect(()=>new FormRules(1)).toThrow(Error);
    expect(()=>new FormRules(1, 2)).toThrow(Error);
    expect(new FormRules()).toBeInstanceOf(FormRules);
    expect(new FormRules(validatorOk, validatorNok, validatorErr)).toBeInstanceOf(FormRules);    
});
it('clone', ()=>{
    const formRules = new FormRules(validatorOk);
    const cloned = formRules.clone();
    expect(cloned).toBeInstanceOf(FormRules);
    expect(formRules!==cloned).toBe(true);
    expect(cloned.getValidators()).toHaveLength(1);
    expect(cloned.getValidators()[0]===formRules.getValidators()[0]).toBe(false);
    expect(cloned.getValidators()[0].getMessage()===formRules.getValidators()[0].getMessage()).toBe(true);
    expect(cloned.getValidators()[0].getValidator()===formRules.getValidators()[0].getValidator()).toBe(true);
});
it('manipulating with validators', ()=>{
    const formRules = new FormRules(validatorOk);
    expect(formRules.getValidators()).toHaveLength(1);
    expect(formRules.getValidators()[0]===validatorOk).toBe(false);
    expect(formRules.getValidators()[0].getMessage()===validatorOk.getMessage()).toBe(true);
    expect(formRules.getValidators()[0].getValidator()===validatorOk.getValidator()).toBe(true);
    const secondValidator = jest.fn();
    const secondErrorMessage = 'second error';
    expect(formRules.addValidator(secondValidator, secondErrorMessage)).toBeInstanceOf(FormRules);
    expect(formRules.getValidators()).toHaveLength(2);
    expect(formRules.getValidators()[1].getMessage()===secondErrorMessage).toBe(true);
    expect(formRules.getValidators()[1].getValidator()===secondValidator).toBe(true);
});
describe('validate', ()=>{
    it('ok', ()=>{
        const formRules = new FormRules(validatorOk);
        expect.assertions(2);
        return formRules.validate()
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(0);
                }
            );
    });
    it('not ok', ()=>{
        const formRules = new FormRules(validatorOk, validatorNok);
        expect.assertions(3);
        return formRules.validate()
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toEqual([errorMessage]);
                }
            );
    });
    it('error', ()=>{
        const formRules = new FormRules(validatorOk, validatorErr);
        expect.assertions(3);
        return formRules.validate()
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toEqual([errorMessage]);
                }
            );
    });
    it('error sync', ()=>{
        const formRules = new FormRules(validatorOk, validatorErr);
        expect.assertions(3);
        return formRules.validate()
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toEqual([errorMessage]);
                }
            );
    });
    it('error aysnc', ()=>{
        const formRules = new FormRules(validatorOk, validatorErrAsync);
        expect.assertions(3);
        return formRules.validate()
            .then(
                errors => {
                    expect(errors).toBeInstanceOf(Array);
                    expect(errors).toHaveLength(1);
                    expect(errors).toEqual([errorMessage]);
                }
            );
    });
});