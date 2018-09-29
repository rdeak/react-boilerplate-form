import FormFieldValidator from '../validators/FormFieldValidator';
import FormFieldOption from './FormFieldOption';

export default function FormField(name) {
    if(!name || typeof name !== 'string') throw new Error('name must be set');
    if(!name.match(/^[A-Z]/i))  throw new Error('name must begin with letter');
    // TODO ovdje napraviti kontorlu da name zadovolja HTML name tag attribute prvila
    const _name = name;
    let _placeholder = '';
    let _validators = [];
    let _decorators = [];
    let _options = [];
    // user defined custom properties
    let _metadata = {};
    let _stopValidationOnFirstFail = true;
    let _required = false;
    let _ignoreValue = false;

    // helper validator
    const requiredValidator = value => !(value === '' || value === null || value === undefined);
    
    this.clone = ()=>{
        const clonedField = new FormField(name)
            .setPlaceholder(_placeholder)
            .addValidators(_validators)
            .addDecorators(_decorators)
            .addOptions(_options)
            .setMetadata(_metadata)
            .stopValidationOnFirstFail(_stopValidationOnFirstFail)
            .ignoreValue(_ignoreValue);

        return clonedField;
    };

    this.getName = () => _name;
    
    this.addValidator = (validationFn, message)=> {
        _validators = [..._validators, new FormFieldValidator(validationFn, message)];
        return this;
    };
    this.addValidators = validators => {
        if(!validators || !(validators instanceof Array)) throw new Error(`validators must be instance of Array, ${typeof validators} given`);
        _validators = validators.map(
            (validator, validatorIndex) => {
                if(!validator || !(validator instanceof FormFieldValidator)) throw new Error(`All validators must be instance of FormFieldValidator, ${typeof validator} at ${validatorIndex} index given`);
                // this is needed for cloning _required properties
                if(validator.getValidator().toString()===requiredValidator.toString()){
                    _required=true;
                }
                return validator.clone();
            }
        );
        return this;
    };
    
    this.getValidators = () => {
        return [..._validators];
    };
    
    this.required = message => {
        this.addValidator(requiredValidator, message);
        _required = true;
        return this;
    };

    this.isRequired = () => _required;

    this.addDecorator = decorator => {
        if(typeof decorator !== 'function') throw new Error(`decorator must be function, ${typeof decorator} given`);
        _decorators=[..._decorators, decorator];
        return this;
    };
    this.addDecorators = decorators => {
        if(!decorators || !(decorators instanceof Array)) throw new Error(`decorators must be instance of Array, ${typeof decorators} given`);
        _decorators = decorators.map(
            (decorator, decoratorIndex) => {
                if(typeof decorator !== 'function') throw new Error(`All decorators in list must be function, ${typeof decorator} at ${decoratorIndex} index given`);
                return decorator;
            }
        );
        return this;
    };
    this.getDecorators = () => _decorators;
    
    this.decorateValue = (value) =>
        _decorators.reduce(
            (decoratedValue, decorator) => decorator(decoratedValue)
            , value
        );

    this.hasEqualValueAs = (anotherFieldName, message) => 
        this.addValidator(
            (fieldValue, formValues)=>!fieldValue || fieldValue===formValues[anotherFieldName], 
            message
        );
    
    this.stopValidationOnFirstFail = flag => {
        if(typeof flag !== 'boolean') throw new Error('Value must be boolean');
        _stopValidationOnFirstFail = flag;
        return this;
    };
    
    this.addOption = (label, value)=>{
        _options = [..._options, new FormFieldOption(label, value)];
        return this;
    };

    this.addOptions = options => {
        if(!options || !(options instanceof Array)) throw new Error(`options must be instance of Array, ${typeof options} given`);
        _options = options.map(
            (option, optionIndex) => {
                if(!(option instanceof FormFieldOption)) throw new Error(`All options in list must be instance of FormFieldOption, ${typeof option} at ${optionIndex} index given`);
                return option.clone();
            }
        );
        return this;
    };
    
    this.getOptions = () => [..._options];
    
    this.setPlaceholder = (placeholder)=>{
        _placeholder = placeholder;
        return this;
    };
    
    this.getPlaceholder = ()=>{
        return _placeholder;
    };
    
    this.setMetadata = metadata => {
        if(typeof metadata !== 'object') throw new Error(`metadata must be instance of object, ${typeof metadata} given`);
        _metadata = {...metadata};
        return this;
    };
    
    this.getMetadata = () => ({..._metadata});
    
    this.validate = (values) => {
        if(!values||typeof values !== 'object'||!(_name in values)) throw new Error('Object with all form values must be provided');
        let fieldErrors = [];
        return _validators.reduce(
            (acc, validator) => {
                return acc
                    .then(() => fieldErrors.length===0 || !_stopValidationOnFirstFail ? validator.validate(values[_name], values) : true)
                    .then(isValid=>fieldErrors=fieldErrors.concat(!isValid ? validator.getMessage():[]))
                    .catch(error=>fieldErrors=fieldErrors.concat(error instanceof Error ? error.message : error));
            }, 
            Promise.resolve(true)
        ).then(
            ()=> fieldErrors
        );
    };

    this.ignoreValue = flag=>{
        if(typeof flag !== 'boolean') throw new Error(`flag must be boolean, ${typeof flag} given`);
        _ignoreValue = flag;
        return this;
    };

    this.isValueIgnored = () => _ignoreValue;
} 
