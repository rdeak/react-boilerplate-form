import FormFieldOption from './FormFieldOption';

it('creates new instance', ()=>{
    expect(()=>new FormFieldOption()).toThrow(Error);
    expect(()=>new FormFieldOption('')).toThrow(Error);
    expect(()=>new FormFieldOption('label')).toThrow(Error);
    expect(()=>new FormFieldOption('label', undefined)).toThrow(Error);
    expect(()=>new FormFieldOption('label', null)).toThrow(Error);
    expect(()=>new FormFieldOption(undefined, undefined)).toThrow(Error);
    expect(()=>new FormFieldOption(undefined, null)).toThrow(Error);
    expect(()=>new FormFieldOption(undefined, {})).toThrow(Error);
    expect(()=>new FormFieldOption(undefined, new Date())).toThrow(Error);
    expect(()=>new FormFieldOption(undefined, [])).toThrow(Error);
    expect(new FormFieldOption('label', 1)).toBeInstanceOf(FormFieldOption);
    expect(new FormFieldOption('label', '1')).toBeInstanceOf(FormFieldOption);
    expect(new FormFieldOption('label', true)).toBeInstanceOf(FormFieldOption);
});
it('getters', ()=>{
    const label = 'type';
    const value = '1';
    const option = new FormFieldOption(label, value);
    expect(option.getLabel()).toEqual(label);
    expect(option.getValue()).toEqual(value);
});
it('clone', ()=>{
    const option = new FormFieldOption('label', '1');
    const clonedOption = option.clone();
    expect(clonedOption).toBeInstanceOf(FormFieldOption);
    expect(clonedOption.getLabel()).toEqual(option.getLabel());
    expect(clonedOption.getValue()).toEqual(option.getValue());
});