import FormField from './FormField';

/**
 * Valid email address pattern by RFC2822
 * https://tools.ietf.org/html/rfc2822#section-3.4.1
 */
// eslint-disable-next-line
const EMAIL_PATTERN = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
/**
 * Valid URL pattern
 */
// eslint-disable-next-line
const URL_PATTERN = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;


const TextFormField = function(name){
    FormField.call(this, name);

    this.uppercase = ()=>
        this.addDecorator(value=>value.toString().toUpperCase());

    this.lowercase = ()=>
        this.addDecorator(value=>value.toString().toLowerCase());

    this.initcap = ()=>
        this.addDecorator(value=>value.charAt(0).toUpperCase()+value.slice(1).toLowerCase());

    this.minLength = (minLength, message) => {
        this.addValidator(
            (fieldValue)=>fieldValue && fieldValue.toString().length>=minLength, 
            message
        );
        return this;
    };
    this.maxLength = (maxLength, message) => {
        this.addValidator(
            (fieldValue)=>fieldValue && fieldValue.toString().length<=maxLength, 
            message
        );
        return this;
    };
    this.matchPattern = (pattern, message) => {
        if(!pattern || !(pattern instanceof RegExp)) throw new Error('pattern must be regex');
        this.addValidator(
            (fieldValue)=>fieldValue && pattern.test(fieldValue), 
            message
        );
        return this;
    };
    this.email = message => this.matchPattern(EMAIL_PATTERN, message);
    this.url = message => this.matchPattern(URL_PATTERN, message);
};
TextFormField.prototype = Object.create(FormField.prototype);
export default TextFormField;