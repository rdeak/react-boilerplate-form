import React from 'react';
import {mount} from 'enzyme';

import Form from './Form';
import FormFieldRules from '../FormFieldRules';

const contextProps = {
    fieldRules: new FormFieldRules(),
    values: {},
    profile: undefined,
    formRules: undefined
};
const onSubmitMock = jest.fn().mockImplementation(()=>true);
const onResetMock = jest.fn().mockImplementation(()=>true);

describe('renders properly', () => {
    it('faac', ()=>{
        const wrapper = mount(<Form {...contextProps} onSubmit={onSubmitMock}>{()=>''}</Form>);
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find('form')).toHaveLength(1);
    });
    it('children', ()=>{
        const wrapper = mount(<Form {...contextProps} onSubmit={onSubmitMock} />);
        expect(wrapper.find(Form)).toHaveLength(1);
        expect(wrapper.find('form')).toHaveLength(1);
    });
});
it('submit', ()=>{
    const wrapper = mount(<Form {...contextProps} onSubmit={onSubmitMock}>{()=>''}</Form>);
    wrapper.find('form').simulate('submit');
    // TODO unable to reference Form with forward ref with enzymne
    //expect(onSubmitMock).toHaveBeenCalledTimes(1);
});
describe('reset', ()=>{
    it('with callback', ()=>{
        const wrapper = mount(<Form {...contextProps} onSubmit={onSubmitMock} onReset={onResetMock} />);
        wrapper.find('form').simulate('reset');
        expect(onResetMock).toHaveBeenCalledTimes(1);
    });
    it('without callback', ()=>{
        const wrapper = mount(<Form {...contextProps} onSubmit={onSubmitMock} />);
        wrapper.find('form').simulate('reset');
        expect(onResetMock).toHaveBeenCalledTimes(1);
    });
    
});
