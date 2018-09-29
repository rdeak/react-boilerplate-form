const FormFieldOption = function(label, value) {
    if(!label || typeof label !== 'string' || label.trim().length === 0) throw new Error('label must be set');
    if(!value || value instanceof Object) throw new Error('invalid value');
    this.clone = () => new FormFieldOption(label, value);
    this.getLabel = () => label;
    this.getValue = () => ''+value;
};
export default FormFieldOption;