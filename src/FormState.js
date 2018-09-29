import FormFieldRules from './FormFieldRules';
import FormRules from './FormRules';
import FormField from './fields/FormField';
import FormValidator from './validators/FormValidator';

const cloneChangedFields = (changedFields) => 
    [...new Set(changedFields)];

const setBool = value => {
    if(typeof value !== 'boolean') throw new Error(`Invalid must be boolean, ${typeof value} given`); 
    return value;
};

export const buildInitialValues = (fieldRules, values) => {
    const getValue = name => (name in values && (values[name]!==undefined && values[name]!==null)) ? values[name] : '';
    return fieldRules.getFieldNames()
        .reduce(
            (accumulatedValues, name) => 
                ({...accumulatedValues, [name]: getValue(name)}),
            {}
        );
};
    

export const buildActiveProfiles = profile => {
    if(!profile) return [];
    const isString = value => value && typeof value === 'string' && value.trim().length > 0;
    const isArrayOfString = value => value && value instanceof Array && value.filter(inListProfile => !isString(inListProfile)).length===0;
    if(!(isString(profile) || isArrayOfString(profile))) throw new Error(`Profile must be non-empty string or Array of strings, ${profile} given`);
    return [].concat(profile);
};

export const buildNewState = (
    fieldRules,
    values, 
    profile, 
    formRules
) => {
    const fieldErrors = fieldRules.getFieldNames().reduce(
        (errors, name) => ({...errors, [name]: []}),
        {}
    );
    const defaultValues = buildInitialValues(fieldRules, values);
    return {
        fieldRules: fieldRules.clone(),
        formRules: formRules ? formRules.clone() : new FormRules(),
        values: defaultValues,
        defaultValues,
        profiles: buildActiveProfiles(profile),
        fieldErrors,
        formErrors: [],
        changedFields: [],
        busy: false
    };
};

const stateKeysConfiguration = {
    fieldRules: {
        default: new FormFieldRules(),
        clone: rules => {
            if(!rules || !(rules instanceof FormFieldRules)) throw new Error('rules must be instance of FormFieldRules');
            return rules.clone();
        },
        append: (field, rules)=>{
            if(!field || !(field instanceof FormField)) throw new Error('field must be instance of FormField');
            return rules.addField(field.clone());
        }
    },
    formRules: {
        default: new FormRules(),
        clone: rules => {
            if(!rules || !(rules instanceof FormRules)) throw new Error('rules must be instance of FormRules');
            return rules.clone();
        },
        append: (validator, formRules)=>{
            if(!validator || !(validator instanceof FormValidator)) throw new Error('validator must be instance of FormValidator');
            const clonedValidator = validator.clone();
            return formRules.addValidator(clonedValidator.getValidator(), clonedValidator.getMessage());
        }
    },
    profiles: {
        default: [],
        clone: profiles => [...profiles],
        append: (newProfile, profiles)=>profiles.concat(newProfile)
    },
    values: {
        default: {}, 
        clone: values => ({...values}),
        append: (newValue, values) => ({...values, ...newValue})
    },
    fieldErrors: {
        default: {},
        clone: fieldErrors => 
            Object.keys(fieldErrors)
                .reduce(
                    (newObject, prop)=>({...newObject, [prop]: [...fieldErrors[prop]]}), 
                    {}
                ),
        append: (newValue, values) => {
            const allFieldNames = [...Object.keys(values), ...Object.keys(newValue)];
            const uniqueFieldNames = [...new Set(allFieldNames)];
            const mergeErrorList = fieldName => 
                [...(values[fieldName] || []), ...(newValue[fieldName] || [])];
            return uniqueFieldNames.reduce(
                (fieldErrors, fieldName) => 
                    ({...fieldErrors, [fieldName]: mergeErrorList(fieldName)})
                , {}
            );
        }
    },
    formErrors: {
        default: [],
        clone: formErrors => [...formErrors],
        append: (newValue, values) => values.concat(newValue)
    },
    busy: {
        default: false,
        clone: setBool,
        append: setBool
    }
};

export default function FormState(push, pull){
    if(typeof push !== 'function') throw new Error('push must be function');
    if(typeof pull !== 'function') throw new Error('pull must be function');

    const hasInvalidKeys = (newValues) =>{
        const filterInvalidKeys = (keyName) => 
            !Object.keys(stateKeysConfiguration)
                .reduce(
                    (hasFound, allowedKeyName) => {
                        return !hasFound ? allowedKeyName === keyName : hasFound;
                    }, 
                    false
                );
        return Object.keys(newValues).filter(filterInvalidKeys).length!==0;
    };

    const getChangedFields = (newValues)=>{
        let changedFields = cloneChangedFields(pull('changedFields'));
        if(!('values' in newValues)) return changedFields;
        const values = this.get('values');
        changedFields = Object.keys(newValues.values)
            .reduce(
                (changedFields, fieldName) => {
                    const oldValue = values[fieldName];
                    const newValue = newValues.values[fieldName];
                    if(fieldName in values && newValue!==oldValue){
                        changedFields = changedFields.concat(fieldName);
                    } 
                    return changedFields;
                },
                [...changedFields]
            );
        return changedFields;
    };

    this.get = name => {
        if(hasInvalidKeys({[name]:''})) throw new Error('name can be only '+Object.keys(stateKeysConfiguration));
        const value = pull(name) || stateKeysConfiguration[name].default;
        return stateKeysConfiguration[name].clone(value);
    };

    this.ref = name => {
        if(hasInvalidKeys({[name]:''})) throw new Error('name can be only '+Object.keys(stateKeysConfiguration));
        const value = pull(name) || stateKeysConfiguration[name].default;
        return value;
    };

    this.set = values => {
        if(!(values instanceof Object)) throw new Error('values must be object');
        if(hasInvalidKeys(values)) throw new Error('values can contain only these members '+Object.keys(stateKeysConfiguration));
        const newValues = Object.keys(values).reduce(
            (newValues, keyName) => {
                const clonedValue = stateKeysConfiguration[keyName].clone(values[keyName]);
                return {...newValues, [keyName]: clonedValue};
            },
            {}
        );
        newValues.changedFields = getChangedFields(values);
        push(newValues);
    };

    this.append = (values) => {
        if(!(values instanceof Object)) throw new Error('values must be object');
        if(hasInvalidKeys(values)) throw new Error('values can contain only these members '+Object.keys(stateKeysConfiguration));
        const newValues = Object.keys(values).reduce(
            (newValues, keyName) => {
                const appendedValue = stateKeysConfiguration[keyName].append(values[keyName], this.get(keyName));
                return {...newValues, [keyName]: appendedValue};
            },
            {}
        );
        newValues.changedFields = getChangedFields(values);
        push(newValues);
    };

    this.getContent = ()=> 
        Object.keys(stateKeysConfiguration).reduce(
            (values, keyName) => {
                const value = this.get(keyName);
                const clonedValue = stateKeysConfiguration[keyName].clone(value);
                return {...values, [keyName]: clonedValue};
            },
            {
                changedFields: cloneChangedFields(pull('changedFields')),
                defaultValues: stateKeysConfiguration.values.clone(pull('defaultValues'))
            }
        );
    
    this.getChangedFields = ()=>{
        return cloneChangedFields(pull('changedFields'));
    };

    this.getDefaultValues = () => {
        const defaultValues = pull('defaultValues');
        return stateKeysConfiguration.values.clone(defaultValues);
    };

    this.reset = () => {
        const values = this.getDefaultValues();
        const cleanFieldErrors = Object.keys(values)
            .reduce(
                (newErrors, prop)=>({...newErrors, [prop]: []})
                , {}
            );
        push({
            values,
            fieldErrors: cleanFieldErrors,
            formErrors: [],
            changedFields: [],
            busy: false
        });
    };
}