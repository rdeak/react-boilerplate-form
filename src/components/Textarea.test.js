import React from 'react';
import {mount} from 'enzyme';

import Textarea from './Textarea';

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
        <Textarea name={fieldname} {...props} />
    </FormTemplateContext.Provider>
);

beforeEach(()=>{
    const storage = new TemporaryStorage();
    storage.push({
        fieldRules
    });
    template = new FormTemplate(storage.push, storage.pull);
});
it('renders properly', () => {
    const wrapper = createComponent();
    expect(wrapper.find(Textarea)).toHaveLength(1);
    expect(wrapper.find('textarea')).toHaveLength(1);
});

it('renders properly with id', ()=>{
    const id='text_id';
    const wrapper = createComponent({id});
    expect(wrapper.find(Textarea)).toHaveLength(1);
    expect(wrapper.find('textarea')).toHaveLength(1);
    expect(wrapper.find(`textarea#${id}`)).toHaveLength(1);
});