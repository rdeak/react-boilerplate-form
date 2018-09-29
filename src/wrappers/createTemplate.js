import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import FormFieldRules from '../FormFieldRules';
import FormRules from '../FormRules';
import {buildNewState} from '../FormState';
import FormTemplateContext from '../FormContext';

function createTemplate(WrappedComponent) {
   
    class FormTemplateWrapper extends React.Component {

        constructor(props){
            super(props);
            this.state = buildNewState(
                this.props.fieldRules, 
                this.props.values, 
                this.props.profile,
                this.props.formRules
            );
            const push = values => this.setState((prevState)=>({...prevState, ...values}));
            const pull = name => this.state[name];
            this.template = new FormTemplate(push, pull);
        }

        componentDidUpdate(prevProps){
            const isChanged = name => prevProps[name] !== this.props[name];

            if(isChanged('fieldRules') || isChanged('values') || isChanged('profile') || isChanged('formRules')){
                this.setState(
                    buildNewState(
                        this.props.fieldRules, 
                        this.props.values, 
                        this.props.profile,
                        this.props.formRules
                    ),
                    this.template.reset()
                );
            }
        }

        render(){
            const {
                fieldRules, 
                values, 
                profile, 
                formRules, 
                ...otherProps
            } = this.props;
            return (
                <FormTemplateContext.Provider value={{template: this.template, token: Math.random()}}>
                    <WrappedComponent 
                        template={this.template}
                        {...otherProps} />
                </FormTemplateContext.Provider>
            );
        }
    }
    FormTemplateWrapper.propTypes = {
        fieldRules: PropTypes.instanceOf(FormFieldRules).isRequired,
        formRules: PropTypes.instanceOf(FormRules),
        values: PropTypes.object.isRequired,
        profile: PropTypes.arrayOf(PropTypes.string)
    };
    return FormTemplateWrapper;
}

export default createTemplate;