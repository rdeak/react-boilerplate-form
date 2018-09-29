import React from 'react';
import {mount} from 'enzyme';

import connectToTemplate from './connectToTemplate';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const fieldname = 'title';
const fieldRules = new FormFieldRules(new TextFormField(fieldname));
let template;

class Dummy extends React.Component{ render(){return <div>content</div>;}}
const WrappedComponent = connectToTemplate(Dummy);

const createComponent = (props) => 
    mount(
        <FormTemplateContext.Provider value={{template}}>
            <WrappedComponent {...props} />
        </FormTemplateContext.Provider>
    );

beforeEach(()=>{
    const storage = new TemporaryStorage();
    storage.push({fieldRules});
    template = new FormTemplate(storage.push, storage.pull);
});

it('renders properly', () => {
    const wrapper = createComponent({foo: 'bar'});
    expect(wrapper.find(Dummy)).toHaveLength(1);
    expect(wrapper.prop('foo')).toEqual('bar');
    expect(template.hasField(fieldname)).toBe(true);
});