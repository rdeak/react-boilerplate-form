import FormField from './FormField';
const NumberFormField = function(name){
    FormField.call(this, name);
    this.lessThen = (value, message)=>{
        this.addValidator(
            fieldValue => fieldValue < value,
            message
        );
        return this;
    };
    this.lessThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => fieldValue < formValues[fieldName],
            message
        );
    this.lessOrEqualThen = (value, message)=>{
        this.addValidator(
            fieldValue => fieldValue <= value,
            message
        );
        return this;
    };
    this.lessOrEqualThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => fieldValue <= formValues[fieldName],
            message
        );
    this.greaterThen = (value, message)=>{
        this.addValidator(
            fieldValue => fieldValue > value,
            message
        );
        return this;
    };
    this.greaterThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => fieldValue > formValues[fieldName],
            message
        );
    this.greaterOrEqualThen = (value, message)=>{
        this.addValidator(
            fieldValue => fieldValue >= value,
            message
        );
        return this;
    };
    this.greaterOrEqualThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => fieldValue >= formValues[fieldName],
            message
        );
    this.positive = message => 
        this.addValidator(
            fieldValue => fieldValue > 0,
            message
        );
    this.positiveWithZero = message => 
        this.addValidator(
            fieldValue => fieldValue >= 0,
            message
        );
    this.negative = message => 
        this.addValidator(
            fieldValue => fieldValue < 0,
            message
        );
    this.negativeWithZero = message => 
        this.addValidator(
            fieldValue => fieldValue <= 0,
            message
        );
    this.decimal = message => {
        // eslint-disable-next-line
        const decimalNumberPattern = /^\-?[0-9]+\.[0-9]+$/;
        return this.addValidator(
            fieldValue => decimalNumberPattern.test(fieldValue),
            message
        );
    };
        
    this.integer = message => 
        this.addValidator(
            fieldValue => Number.isInteger(fieldValue),
            message
        );
};
NumberFormField.prototype = Object.create(FormField.prototype);
export default NumberFormField;