import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Input(props) {
    const {id, name, template, ...otherProps } = props;
    
    let templateProps = {};
    if (props.type === 'radio'){
        templateProps = template.getRadioHandlers(name, props.value);
    } else {
        templateProps = {
            placeholder: template.getField(name).getPlaceholder(),
            ...template.getInputHandlers(name)
        };
    }
    
    return <input 
        {...otherProps}
        id={id || name}
        name={name}
        {...templateProps}
    />;
}

Input.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    name: PropTypes.string.isRequired,
};

export default connectToTemplate(Input);