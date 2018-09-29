import FormField from './FormField';
import {parseDate} from 'yadate-converter';

const DateFormField = function(name, format, errorFormatMessage){
    if(!format || typeof format !=='string') throw new Error('Format must be set');
    FormField.call(this, name);
    const _inFormat = format;
    
    const castToDate = value => parseDate(value, _inFormat);

    this.addValidator(
        (fieldValue)=>!fieldValue || castToDate(fieldValue)!==null,
        errorFormatMessage
    );
    
    this.lessThen = (value, message)=>{
        if(!(value instanceof Date)) throw new Error('Value must be instance of Date');
        this.addValidator(
            fieldValue => castToDate(fieldValue) < value,
            message
        );
        return this;
    };
    this.lessThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => castToDate(fieldValue) < castToDate(formValues[fieldName]),
            message
        );
    this.lessOrEqualThen = (value, message)=>{
        if(!(value instanceof Date)) throw new Error('Value must be instance of Date');
        this.addValidator(
            fieldValue => castToDate(fieldValue) <= value,
            message
        );
        return this;
    };
    this.lessOrEqualThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => castToDate(fieldValue) <= castToDate(formValues[fieldName]),
            message
        );
    this.greaterThen = (value, message)=>{
        if(!(value instanceof Date)) throw new Error('Value must be instance of Date');
        this.addValidator(
            fieldValue => castToDate(fieldValue) > value,
            message
        );
        return this;
    };
    this.greaterThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => castToDate(fieldValue) > castToDate(formValues[fieldName]),
            message
        );
    this.greaterOrEqualThen = (value, message)=>{
        if(!(value instanceof Date)) throw new Error('Value must be instance of Date');
        this.addValidator(
            fieldValue => castToDate(fieldValue) >= value,
            message
        );
        return this;
    };
    this.greaterOrEqualThenField = (fieldName, message) => 
        this.addValidator(
            (fieldValue, formValues) => castToDate(fieldValue) >= castToDate(formValues[fieldName]),
            message
        );
};
DateFormField.prototype = Object.create(FormField.prototype);
export default DateFormField;