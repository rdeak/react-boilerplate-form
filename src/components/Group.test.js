import React from 'react';
import {mount} from 'enzyme';

import Group from './Group';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const fieldname = 'title';
const fieldRules = new FormFieldRules(
    new TextFormField(fieldname)
        .addOption('Female', 'F')
        .addOption('Male', 'M')
);
let template;

const createComponent = (fieldname) => mount(
    <FormTemplateContext.Provider value={{template}}>
        <Group name={fieldname}>{
            (label, value, index) => 
                <React.Fragment key={index}>
                    <input type="checkbox" name={value}/>
                    <span>{label}</span>
                </React.Fragment>
        }</Group>
    </FormTemplateContext.Provider>
);

beforeEach(()=>{
    const storage = new TemporaryStorage();
    storage.push({
        fieldRules
    });
    template = new FormTemplate(storage.push, storage.pull);
});
it('renders properly', ()=>{
    const wrapper = createComponent(fieldname);
    expect(wrapper.find(Group)).toHaveLength(1);
    expect(wrapper.find('input[type="checkbox"][name="F"]')).toHaveLength(1);
    expect(wrapper.find('input[type="checkbox"][name="M"]')).toHaveLength(1);
    expect(wrapper.contains(<span>Female</span>)).toEqual(true);
    expect(wrapper.contains(<span>Male</span>)).toEqual(true);
});
it('error on undefined field name', ()=>{
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});
    expect(()=>createComponent('invalid_field_name')).toThrow(Error);
    global.console.error.mockRestore();
});