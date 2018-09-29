import React from 'react';
import {mount} from 'enzyme';

import Errors from './Errors';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const fieldname = 'title';
const fieldErrorMessage = 'field error message';
const formErrorMessage = 'form error message';
const fieldRules = new FormFieldRules(new TextFormField(fieldname));
let template;

const createComponent = (props) => mount(
    <FormTemplateContext.Provider value={{template}}>
        <Errors {...props}>
            {(message, index) => <span key={index}>{message}</span>}
        </Errors>
    </FormTemplateContext.Provider>
);

beforeEach(()=>{
    const storage = new TemporaryStorage();
    storage.push({
        fieldRules,
        formErrors: [formErrorMessage], 
        fieldErrors: {[fieldname]:[fieldErrorMessage]}
    });
    template = new FormTemplate(storage.push, storage.pull);
});
it('renders properly field', ()=>{
    const wrapper = createComponent({name: fieldname});
    expect(wrapper.find(Errors)).toHaveLength(1);
    expect(wrapper.contains(fieldErrorMessage)).toBe(true);
});
it('renders properly form', () => {
    const wrapper = createComponent({onlyForm: true});
    expect(wrapper.find(Errors)).toHaveLength(1);
    expect(wrapper.contains(formErrorMessage)).toBe(true);
});
it('renders properly all', () => {
    const wrapper = createComponent({});
    expect(wrapper.find(Errors)).toHaveLength(1);
    expect(wrapper.contains(fieldErrorMessage)).toBe(true);
    expect(wrapper.contains(formErrorMessage)).toBe(true);
});
it('error on undefined field name', ()=>{
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});
    expect(()=>createComponent({name: 'invalid_filedname'})).toThrow(Error);
    global.console.error.mockRestore();
});