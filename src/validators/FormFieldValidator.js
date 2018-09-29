export default function FormFieldValidator(validationFn, message) {
    if(typeof validationFn !== 'function') throw new Error(`validationFn must be function, ${typeof validationFn} given`);
    if(!message || typeof message !== 'string' || message.trim().length === 0) throw new Error(`message must be set, ${message} given`);
    this.clone = () => new FormFieldValidator(validationFn, message);
    this.getMessage = () => message;
    this.getValidator = () => validationFn;
    this.validate = (fieldValue, formValues) => validationFn(fieldValue, formValues);
}