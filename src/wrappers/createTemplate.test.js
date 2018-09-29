import React from 'react';
import {mount} from 'enzyme';

import createTemplate from './createTemplate';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormField from '../fields/FormField';

function Component(){
    return <div>content</div>;
}
const FormTemplateWrapper = createTemplate(Component);
let wrapper;

beforeEach(()=>{
    const fieldRules = new FormFieldRules(new TextFormField('A'));
    const values = {'A': 1};
    wrapper = mount(<FormTemplateWrapper fieldRules={fieldRules} values={values} />);
});
it('renders properly', () => {
    expect(wrapper.find(Component)).toHaveLength(1);
    expect(Object.keys(wrapper.find(Component).props())).toEqual(['template']);
});
it('fields and values changed', ()=>{
    const fieldRules = new FormFieldRules(new FormField('A'), new FormField('B'));
    const values =  {A: 4, B: 2};
    wrapper.setProps({fieldRules, values});
    expect(wrapper.state('values')).toEqual(values);
    expect(wrapper.state('fieldRules').getFieldNames()).toEqual(fieldRules.getFieldNames());
});