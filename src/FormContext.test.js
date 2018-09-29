import FormContext, { createNewContextValue } from './FormContext';

it('createNewContextValue', ()=>{
    const context = createNewContextValue();
    expect(context).toBeInstanceOf(Object);
    expect(Object.keys(context)).toEqual(['template', 'token']);
})