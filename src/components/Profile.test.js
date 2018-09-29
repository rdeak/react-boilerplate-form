import React from 'react';
import {mount} from 'enzyme';

import Profile from './Profile';

import FormFieldRules from '../FormFieldRules';
import TextFormField from '../fields/TextFormField';
import FormTemplate from '../FormTemplate';
import FormTemplateContext from '../FormContext';
import TemporaryStorage from '../storages/TemporaryStorage';

const fieldname = 'title';
const fieldRules = new FormFieldRules(new TextFormField(fieldname));
const profiles = ['profile A', 'profile B', 'profile C'];
let template;
let storage;

const createComponent = props => {
    return mount(
        <FormTemplateContext.Provider value={{template}}>
            <Profile {...props}>
                <div>content</div>
            </Profile>
        </FormTemplateContext.Provider>
    );
};

beforeEach(()=>{
    storage = new TemporaryStorage();
    storage.push({
        fieldRules
    });
    template = new FormTemplate(storage.push, storage.pull);
});
it('not set', ()=>{
    const wrapper = createComponent();
    expect(wrapper.contains(<div>content</div>)).toEqual(true);
});
it('active profile set without showOn and hideOn', ()=>{
    storage.push({profiles});
    const wrapper = createComponent();
    expect(wrapper.contains(<div>content</div>)).toEqual(true);
});
it('visible', () => {
    
    storage.push({profiles});
    let wrapper;
    wrapper = createComponent({showOn: profiles.slice(0,1)});
    expect(wrapper.contains(<div>content</div>)).toEqual(true);
    wrapper = createComponent({showOn: ['Profile D']});
    expect(wrapper.contains(<div>content</div>)).toEqual(false);
});
it('invisible', () => {
    storage.push({profiles});
    let wrapper;
    wrapper = createComponent({hideOn: profiles.slice(1,2)});
    expect(wrapper.contains(<div>content</div>)).toEqual(false);
    wrapper = createComponent({hideOn: ['profile D']});
    expect(wrapper.contains(<div>content</div>)).toEqual(true);
});