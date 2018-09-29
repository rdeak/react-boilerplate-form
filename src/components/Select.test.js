import React from 'react';
import {mount} from 'enzyme';

import Select from './Select';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const id='select_id';
const fieldname = 'title';

const createComponent = (props, ...fields) => {
    const fieldRules = new FormFieldRules(...fields);
    const storage = new TemporaryStorage();
    storage.push({
        fieldRules
    });
    const template = new FormTemplate(storage.push, storage.pull);

    return mount(
        <FormTemplateContext.Provider value={{template}}>
            <Select name={fieldname} {...props} />
        </FormTemplateContext.Provider>
    );
};

it('renders properly', () => {
    const field = new TextFormField(fieldname);
    const wrapper = createComponent({}, field);
    expect(wrapper.find(Select)).toHaveLength(1);
    expect(wrapper.find('select')).toHaveLength(1);
    expect(wrapper.find('option')).toHaveLength(1);
});

describe('required', ()=>{
    it('without values', ()=>{
        const field = new TextFormField(fieldname).required('err');
        const wrapper = createComponent({id}, field);
        expect(wrapper.find(Select)).toHaveLength(1);
        expect(wrapper.find('select')).toHaveLength(1);
        expect(wrapper.find(`select#${id}`)).toHaveLength(1);
        expect(wrapper.exists('option')).toBe(false);
    });
    it('with values', ()=>{
        const field = new TextFormField(fieldname).addOption('female', 'f').addOption('male', 'm').required('err');
        const wrapper = createComponent({id}, field);
        expect(wrapper.find(Select)).toHaveLength(1);
        expect(wrapper.find('select')).toHaveLength(1);
        expect(wrapper.find(`select#${id}`)).toHaveLength(1);
        expect(wrapper.find('option')).toHaveLength(2);
        expect(wrapper.find('option').at(0).is('[value="f"]')).toBe(true);
        expect(wrapper.find('option').at(1).is('[value="m"]')).toBe(true);
    });
    
});

it('with values', ()=>{
    const field = new TextFormField(fieldname).addOption('female', 'f').addOption('male', 'm');
    const wrapper = createComponent({id}, field);
    expect(wrapper.find(Select)).toHaveLength(1);
    expect(wrapper.find('select')).toHaveLength(1);
    expect(wrapper.find(`select#${id}`)).toHaveLength(1);
    expect(wrapper.find('option')).toHaveLength(3);
    expect(wrapper.find('option').at(0).is('[value=""]')).toBe(true);
    expect(wrapper.find('option').at(1).is('[value="f"]')).toBe(true);
    expect(wrapper.find('option').at(2).is('[value="m"]')).toBe(true);
});