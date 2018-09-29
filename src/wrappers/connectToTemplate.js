import React from 'react';
import FormTemplateContext from '../FormContext';

function connectToTemplate(Component){
    function WrappedComponent(props){
        return (
            <FormTemplateContext.Consumer>
                {contextValue => <Component {...props} template={contextValue.template} />}
            </FormTemplateContext.Consumer>
        );
    }
    return WrappedComponent;
}

export default connectToTemplate;