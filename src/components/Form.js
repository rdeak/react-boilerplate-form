import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import createTemplate from '../wrappers/createTemplate';

function Form(props) {    
    const submit = event => {
        event.preventDefault();
        props.template.submit(props.onSubmit);
    };
    
    const reset = event => {
        event.preventDefault(); 
        props.template.reset();
        if(props.onReset){
            props.onReset();
        }
    };

    const { template, onSubmit, onReset, ...otherProps } = props;    

    // expose helper functions from FormTemplate as props
    const formHelpers = {
        field: template.getField,
        isDirty: template.isDirty,
        isPristine: template.isPristine,
        isInvalid: template.isInvalid,
        isValid: template.isValid,
        isBusy: template.isBusy
    };

    const isFaaC = typeof props.children === 'function';
    const content = isFaaC ? props.children(formHelpers) : props.children || '';

    return (
        <form onSubmit={submit} onReset={reset} {...otherProps}>
            {content}
        </form>
    );
}

Form.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func,
};

export default createTemplate(Form);