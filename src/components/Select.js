import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Select(props) {
    const { id, name, template, ...otherProps } = props;
    const field = template.getField(name);
    
    let options = field
        .getOptions()
        .map( 
            (option, optionIndex) => 
                <option key={optionIndex} value={option.getValue()} >{option.getLabel()}</option>
            
        );

    // add empty option if field is not required
    if(!field.isRequired()){
        options = [
            <option key="-1" value="" />,
            ...options
        ];
    }

    return (
        <select 
            {...otherProps}
            id={id || name} 
            name={name} 
            {...template.getInputHandlers(name)}
        >
            {options}
        </select>
    );
}
Select.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    name: PropTypes.string.isRequired,
};
export default connectToTemplate(Select);