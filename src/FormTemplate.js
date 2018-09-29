import FormState from './FormState';

function FormTemplate(push, pull){
    if(typeof push !== 'function') throw new Error(`push must be function, ${typeof push} given`);
    if(typeof pull !== 'function') throw new Error(`pull must be function, ${typeof pull} given`);
    const _state = new FormState(push, pull);
    
    this.getValues = () => {
        const values = _state.get('values');
        const fieldRules = _state.ref('fieldRules');
        return fieldRules
            .getFields()
            .filter(field => !field.isValueIgnored())
            .map(field => field.getName())
            .reduce(
                (returnValues, fieldName) => ({ 
                    ...returnValues,
                    [fieldName]: values[fieldName]
                })
                , {}
            );
    };

    this.getActiveProfiles = () => _state.get('profiles');
    
    this.getFormErrors = () => _state.get('formErrors');
    
    this.getFieldErrors = () => _state.get('fieldErrors');

    this.getField = name => _state.ref('fieldRules').getField(name);

    this.hasField = name => _state.ref('fieldRules').hasField(name);

    const parseEvent = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        return {name, value};
    };

    this.onFieldChange = event => { 
        const {name, value} = parseEvent(event); 
        const fieldRules = _state.ref('fieldRules');
        if(!fieldRules.hasField(name)) throw new Error(`Field ${name} doesn't exist!`);
        const field = fieldRules.getField(name);
        _state.append({
            values: {[name]: field.decorateValue(value)}
        });
    };

    this.onFieldBlur = event => {
        const {name} = parseEvent(event); 
        this.validateField(name);
    };

    this.getInputHandlers = name =>({
        value: _state.ref('values')[name],
        onChange: this.onFieldChange,
        onBlur: this.onFieldBlur
    });

    this.getRadioHandlers = (name, value) => ({
        checked: _state.get('values')[name]===value,
        onChange: this.onFieldChange
    });

    this.validateField = name => {
        const fieldRules = _state.ref('fieldRules');
        const values =  _state.get('values');
        return fieldRules
            .validateField(name, values)
            .then( errors => {
                _state.append({fieldErrors: {[name]: errors}});
                return errors.length === 0;
            });
    };

    this.validateFields = ()=>{
        const fieldRules = _state.ref('fieldRules');
        const values = _state.get('values');
        
        return fieldRules.validateFields(values)
            .then(
                ({errors, isValid})=> {
                    _state.set({fieldErrors: errors});
                    return isValid;
                }
            );
    };

    this.validateForm = () => {
        const formRules = _state.ref('formRules');
        const values = _state.get('values');
        return formRules.validate(values)
            .then(
                formErrors => {
                    _state.set({formErrors});
                    return formErrors.length===0;
                }
            );
    };

    this.validate = ()=>{
        return Promise.all([
            this.validateFields(),
            this.validateForm(),
        ])
            .then(
                result => result[0] && result[1]
            );
    };

    this.submit = onSubmit => {
        if(typeof onSubmit !== 'function') throw new Error(`onSubmit must be function, ${typeof onSubmit} given`);
        _state.set({busy: true});
        return this.validate()
            .then(
                isValid => {
                    _state.set({busy: false});
                    return isValid;
                }
            )
            .then(
                isValid => 
                    isValid ? onSubmit(this.getValues()) : null
            )
            .catch(
                error => {
                    const errorMessage = error instanceof Error ? error.message : error;
                    // TODO ovo izvući u zasebnu varijablu koja neće biti dio formErrors
                    _state.append({
                        formErrors: errorMessage,
                        busy: false
                    });
                    return false;
                }
            );
    };

    this.reset = () => {
        _state.set({busy: true});
        _state.reset();
    };

    this.isDirty = name => {
        const changedFields = _state.getChangedFields();
        return (!name ? changedFields : changedFields.filter(fieldName=>fieldName===name)).length>0;
    };
    this.isPristine = name => !this.isDirty(name);
    
    this.isInvalid = name => {
        const hasErrors = errors => Object.keys(errors).reduce(
            (invalid, fieldName) => invalid ? invalid : errors[fieldName].length!==0
            , false
        );
        const fieldErrors = _state.get('fieldErrors');
        const formErrors = _state.get('formErrors');
        return name ? fieldErrors[name] && fieldErrors[name].length!==0 : (hasErrors(fieldErrors) || formErrors.length!==0);
    };
    this.isValid = name => !this.isInvalid(name);

    this.isBusy = () => _state.ref('busy');
}

export default FormTemplate;