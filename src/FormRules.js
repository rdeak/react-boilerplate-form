import FormValidator from './validators/FormValidator';
function FormRules(...validators){
    // form level validators
    let _validators = [];
    
    if(validators.length>0){
        _validators = validators.map(
            (validator, validatorIndex) => {
                if(!validator || !(validator instanceof FormValidator)) throw new Error(`All validators must be instance of FormValidator, ${typeof validator} at ${validatorIndex} index given`);
                return validator.clone();
            }
        );
    }
    
    this.clone = ()=>{
        return new FormRules(..._validators);
    };
    this.addValidator = (validationFn, message)=> {
        _validators = [..._validators, new FormValidator(validationFn, message)];
        return this;
    };
    this.getValidators = () => [..._validators];

    this.validate = values=>{
        let formErrors = [];
        return _validators.reduce(
            (acc, validator) => {
                return acc
                    .then(
                        () => 
                            formErrors.length===0 ? validator.validate(values) : true
                    )
                    .then(
                        isValid => 
                            formErrors=formErrors.concat(!isValid ? validator.getMessage():[])
                    )
                    .catch(
                        error =>
                            formErrors=formErrors.concat(error instanceof Error ? error.message : error)
                    );
            }, 
            Promise.resolve(true)
        ).then(
            ()=> {
                return formErrors;
            }
        );
    };
}

export default FormRules;