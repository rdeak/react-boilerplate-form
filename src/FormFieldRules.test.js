import FormFieldRules from './FormFieldRules';
import FormField from './fields/FormField';

const fieldName = 'title';
const nonExistantFieldName = 'subtitle';
let field;
let fieldRules;

beforeEach(()=>{
    field = new FormField(fieldName);
});
it('creates new instance', ()=>{
    const fieldRules = new FormFieldRules();
    expect(fieldRules).toBeInstanceOf(FormFieldRules);
    expect(fieldRules.getFields()).toBeInstanceOf(Array);
    expect(fieldRules.getFields()).toHaveLength(0);
});
it('non existent field', ()=>{
    fieldRules = new FormFieldRules(field);
    expect(()=>fieldRules.getField(nonExistantFieldName)).toThrow(Error);
    expect(()=>fieldRules.setValue(nonExistantFieldName, null)).toThrow(Error);
    expect(()=>fieldRules.getValue(nonExistantFieldName)).toThrow(Error);
});
it('add invalid field', ()=>{
    const fieldRules = new FormFieldRules();
    expect(()=>fieldRules.addField()).toThrow(Error);
    expect(()=>fieldRules.addField(undefined)).toThrow(Error);
    expect(()=>fieldRules.addField(null)).toThrow(Error);
    expect(()=>fieldRules.addField('name')).toThrow(Error);
    expect(()=>fieldRules.addField([])).toThrow(Error);
    expect(()=>fieldRules.addField({})).toThrow(Error);
    expect(()=>fieldRules.addField(new Date())).toThrow(Error);
});
it('add a field', ()=>{
    const fieldRules = new FormFieldRules();
    expect(fieldRules.addField(field)).toBeInstanceOf(FormFieldRules);
    expect(fieldRules.getFields()).toBeInstanceOf(Array);
    expect(fieldRules.getFields()).toHaveLength(1);
    expect(fieldRules.getFields()[0]).toEqual(field);
    expect(fieldRules.getField(fieldName)).toEqual(field);
    expect(fieldRules.hasField(fieldName)).toBe(true);
    expect(fieldRules.getFieldNames()).toEqual([fieldName]);
});
it('adding two fields with same name', ()=>{
    const fieldRules = new FormFieldRules();
    expect(fieldRules.addField(field)).toBeInstanceOf(FormFieldRules);
    expect(()=>fieldRules.addField(field)).toThrow(Error);
});
it('get field options', ()=>{
    const fieldRules = new FormFieldRules();
    const label = 'Label';
    const value = 'Value';
    field.addOption(label, value);
    const options = fieldRules.addField(field).getFieldOptions(fieldName);
    expect(options).toBeInstanceOf(Array);
    expect(options).toHaveLength(1);
    expect(options[0].getLabel()).toEqual(label);
    expect(options[0].getValue()).toEqual(value);
    expect(()=>fieldRules.getFieldOptions()).toThrow(Error);
});