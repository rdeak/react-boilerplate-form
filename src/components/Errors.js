import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Errors(props){
    const { name, template, onlyForm } = props;

    const fieldErrors = () => {
        if(!name || onlyForm) return [];
        if(!template.hasField(name)) throw new Error (`Unrecognized field: ${name}`);
        return template.getFieldErrors()[name];
    };
    const formErrors = () => {
        if(!onlyForm) return [];
        return template.getFormErrors();
    };
    const allErrors = () => {
        if(name || onlyForm) return [];
        const allFieldErrors = () => {
            const fieldErrors = template.getFieldErrors();
            return Object.keys(fieldErrors).reduce(
                (flatFieldErrors, fieldname) => [...flatFieldErrors, ...fieldErrors[fieldname]],
                []
            );
        }
        return [...allFieldErrors(), ...template.getFormErrors()];
    };

    const errors = [...fieldErrors(), ...formErrors(), ...allErrors()];
    return (
        <React.Fragment>
            {errors.map(
                (error, errorIndex) => 
                    props.children(error, errorIndex)
            )}
        </React.Fragment>
    );
}
Errors.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    children: PropTypes.func.isRequired,
    name: PropTypes.string,
    onlyForm: PropTypes.bool
};
export default connectToTemplate(Errors);