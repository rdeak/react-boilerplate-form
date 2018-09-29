import React from 'react';
import {mount} from 'enzyme';

import Input from './Input';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const fieldname = 'title';
const fieldRules = new FormFieldRules(new TextFormField(fieldname));
let template;

const createComponent = props => mount(
    <FormTemplateContext.Provider value={{template}}>
        <Input name={fieldname} {...props} />
    </FormTemplateContext.Provider>
);

beforeEach(()=>{
    const storage = new TemporaryStorage();
    storage.push({
        fieldRules
    });
    template = new FormTemplate(storage.push, storage.pull);
});
it('renders properly bare', () => {
    const wrapper = createComponent();
    expect(wrapper.find(Input)).toHaveLength(1);
    expect(wrapper.find('input')).toHaveLength(1);
});
it('renders propery text', ()=>{
    const id='some_id';
    const type='text';
    const wrapper = createComponent({id, type});
    expect(wrapper.find(Input)).toHaveLength(1);
    expect(wrapper.find(`input[type="${type}"]`)).toHaveLength(1);
    expect(wrapper.find(`input#${id}`)).toHaveLength(1);
});
it('renders propery radio', ()=>{
    const id='some_id';
    const type='radio';
    const wrapper = createComponent({id, type});
    expect(wrapper.find(Input)).toHaveLength(1);
    expect(wrapper.find(`input[type="${type}"]`)).toHaveLength(1);
    expect(wrapper.find(`input#${id}`)).toHaveLength(1);
});
it('error on undefined field name', ()=>{
    const Component = () => (
        <FormTemplateContext.Provider>
            <Input name="invalid_field_name" />
        </FormTemplateContext.Provider>
    );
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});
    expect(()=>mount(<Component />)).toThrow(Error);
    global.console.error.mockRestore();
});