import FormField from './fields/FormField';

function FormFieldRules(...fields){
    let _fields = [];
    // map of fields name and index in _fields array
    let _fieldIndex = {};

    this.clone = () => {
        const clonedFields = _fields.map( field => field.clone());
        return new FormFieldRules(...clonedFields);
    };
    
    this.addField = (field)=>{
        if(field === undefined || field === null || !(field instanceof FormField )) throw new Error(`field must be instace of Form field, ${typeof field} given`);
        if(this.hasField(field.getName())) throw new Error(`Field ${field.getName()} already exists`);
        _fields = [..._fields, field];
        _fieldIndex = {..._fieldIndex, [field.getName()]: _fields.length-1};
        return this;
    };

    this.getFields = () => {
        return _fields;
    };

    this.getFieldNames = () => Object.keys(_fieldIndex);

    this.getField = (name) => {
        if(!this.hasField(name)) throw new Error(`Field ${name} doesn't exist!`);
        return _fields[_fieldIndex[name]];
    };

    this.hasField = name => _fieldIndex.hasOwnProperty(name);

    this.getFieldOptions = (name) => {
        if(!this.hasField(name)) throw new Error(`Field ${name} doesn't exist!`);
        return this.getField(name).getOptions();
    };

    this.validateField = (name, values) => {
        return this
            .getField(name)
            .validate(values);
    };

    this.validateFields = values=>{
        let errors = {};
        let isValid = true;
        return this
            .getFields()
            .reduce(
                (acc, field) => {
                    const name = field.getName();
                    return acc
                        // FormField.validate take care of exceptions in catch block
                        .then(() => field.validate(values))
                        .then(
                            fieldErrors => {
                                isValid = isValid ? fieldErrors.length===0 : false;
                                errors={...errors, [name]: fieldErrors};
                                return fieldErrors.length===0;
                            }
                        );
                }, 
                Promise.resolve(true)
            )
            .then(
                ()=> {
                    return {errors, isValid};
                });
    };

    fields.forEach(field => this.addField(field));
}

export default FormFieldRules;