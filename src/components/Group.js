import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Group(props){
    const { name, template } = props;

    if(!template.hasField(name)) throw new Error (`Unrecognized field: ${name}`);

    const options = template.getField(name).getOptions();
    
    return (
        <React.Fragment>
            {options.map(
                (option, optionIndex) => 
                    props.children(option.getLabel(), option.getValue(), optionIndex)
            )}
        </React.Fragment>
    );
}
Group.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    children: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
};
export default connectToTemplate(Group);