export default function FormValidator(validationFn, message) {
    if(typeof validationFn !== 'function') throw new Error(`validationFn must be function, ${typeof validationFn} given`);
    if(!message || typeof message !== 'string' || message.trim().length === 0) throw new Error('message must be set');
    this.clone = () => new FormValidator(validationFn, message);
    this.getMessage = () => message;
    this.getValidator = () => validationFn;
    this.validate = formValues => validationFn(formValues);
}