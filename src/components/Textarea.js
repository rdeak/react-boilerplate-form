import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Textarea(props){
    const { id, name, template, ...otherProps } = props;
    
    return <textarea 
        {...otherProps}
        id={id || name}
        name={name}
        placeholder={template.getField(name).getPlaceholder()}
        {...template.getInputHandlers(name)}
    />;
}

Textarea.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    name: PropTypes.string.isRequired,
};

export default connectToTemplate(Textarea);