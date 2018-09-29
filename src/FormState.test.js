import FormState, {buildInitialValues, buildActiveProfiles, buildNewState} from './FormState';
import TemporaryStorage from './storages/TemporaryStorage';
import FormFieldRules from './FormFieldRules';
import FormField from './fields/FormField';
import FormRules from './FormRules';
import FormValidator from './validators/FormValidator';

it('buildInitialValues', ()=>{
    const fieldRules = new FormFieldRules(
        new FormField('A'),
        new FormField('B'),
        new FormField('C')
    );
    const values = {
        'A': undefined,
        'B': null,
        'C': 0,
        'D': 5
    };
    expect(buildInitialValues(fieldRules, values)).toEqual({'A': '', 'B': '', 'C': 0});
});

it('buildActiveProfiles', ()=>{
    expect(buildActiveProfiles('A')).toEqual(['A']);
    expect(buildActiveProfiles(['A', 'B'])).toEqual(['A', 'B']);
    expect(()=>buildActiveProfiles(true)).toThrow(Error);
    expect(()=>buildActiveProfiles(5)).toThrow(Error);
    expect(()=>buildActiveProfiles(['A', 5])).toThrow(Error);
});

it('buildNewState', ()=>{
    const fieldRules = new FormFieldRules(new FormField('A'));
    const values = {};
    const profile = ['A'];
    const formRules = new FormRules();
    const state = buildNewState(fieldRules, values, profile, formRules);
    expect(Object.keys(state)).toEqual([
        'fieldRules', 'formRules', 'values', 'defaultValues', 
        'profiles', 'fieldErrors', 'formErrors', 
        'changedFields', 'busy'
    ]);
    expect(state.fieldRules===fieldRules).toBe(false);
    expect(state.profiles===profile).toBe(false);
    expect(state.formRules===formRules).toBe(false);
    expect(state.values===values).toBe(false);
    expect(state.defaultValues===values).toBe(false);
});

describe('state manipulation', ()=>{
    let state;
    let storage;

    beforeEach(()=>{
        storage = new TemporaryStorage();
        state = new FormState(storage.push, storage.pull);
    });
    it('creates a new instance', ()=>{
        expect(()=>new FormState()).toThrow(Error);
        expect(()=>new FormState(jest.fn())).toThrow(Error);
        expect(new FormState(jest.fn(), jest.fn())).toBeInstanceOf(FormState);
    });
    it('undefined key', ()=>{
        expect(()=>state.set()).toThrow(Error);
        expect(()=>state.set({a: 1})).toThrow(Error);
        expect(()=>state.get()).toThrow(Error);
        expect(()=>state.get('a')).toThrow(Error);
        expect(()=>state.append()).toThrow(Error);
        expect(()=>state.append({'a': 1})).toThrow(Error);
        expect(()=>state.ref()).toThrow(Error);
        expect(()=>state.ref('a')).toThrow(Error);
    });    
    it('fieldRules', ()=>{
        const name = 'fieldRules';
        const defaultValue = state.get(name);
        expect(defaultValue).toBeInstanceOf(FormFieldRules);
        state.set({fieldRules: defaultValue});
        expect(state.ref(name)).toBeInstanceOf(FormFieldRules);
        expect(state.get(name)).toBeInstanceOf(FormFieldRules);
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.append({fieldRules: new FormField('A')});
        expect(state.ref(name).hasField('A')).toBe(true);
        expect(()=>state.set({fieldRules: false})).toThrow(Error);
        expect(()=>state.append({fieldRules: false})).toThrow(Error);
    });
    it('formRules', ()=>{
        const name = 'formRules';
        const defaultValue = state.get(name);
        expect(defaultValue).toBeInstanceOf(FormRules);
        state.set({formRules: defaultValue});
        expect(state.ref(name)).toBeInstanceOf(FormRules);
        expect(state.get(name)).toBeInstanceOf(FormRules);
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.append({formRules: new FormValidator(()=>true, 'error message')});
        expect(state.ref(name).getValidators()).toHaveLength(1);
        expect(()=>state.set({formRules: false})).toThrow(Error);
        expect(()=>state.append({formRules: false})).toThrow(Error);
    });
    it('profiles', ()=>{
        const name = 'profiles';
        const defaultValue = state.get(name);
        expect(defaultValue).toEqual([]);
        state.set({profiles: defaultValue});
        expect(state.ref(name)).toEqual([]);
        expect(state.get(name)).toEqual([]);
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.append({profiles: 'A'});
        expect(state.ref(name)).toEqual(['A']);
    });
    it('values', ()=>{
        const name = 'values';
        const defaultValue = state.get(name);
        expect(defaultValue).toEqual({});
        state.set({values: defaultValue});
        expect(state.ref(name)).toEqual({});
        expect(state.get(name)).toEqual({});
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.set({values: {'A': 1}});
        state.append({values: {'B': 2}});
        expect(state.ref(name)).toEqual({'A': 1, 'B': 2});
        state.append({values: {'A': 2}});
        expect(state.ref(name)).toEqual({'A': 2, 'B': 2});
    });
    it('fieldErrors', ()=>{
        const name = 'fieldErrors';
        const defaultValue = state.get(name);
        expect(defaultValue).toEqual({});
        state.set({fieldErrors: defaultValue});
        expect(state.ref(name)).toEqual({});
        expect(state.get(name)).toEqual({});
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.set({fieldErrors: {'A': ['error 1']}});
        state.append({fieldErrors: {'A': ['error 2']}});
        expect(state.ref(name)).toEqual({'A': ['error 1', 'error 2']});
        state.append({fieldErrors: {'B': ['error 3']}});
        expect(state.ref(name)).toEqual({'A': ['error 1', 'error 2'], 'B': ['error 3']});
    });
    it('formErrors', ()=>{
        const name = 'formErrors';
        const defaultValue = state.get(name);
        expect(defaultValue).toEqual([]);
        state.set({formErrors: defaultValue});
        expect(state.ref(name)).toEqual([]);
        expect(state.get(name)).toEqual([]);
        expect(state.get(name)===defaultValue).toBe(false);
        expect(state.get(name)===storage.pull(name)).toBe(false);
        expect(state.get(name)===state.ref(name)).toBe(false);
        expect(storage.pull(name)===state.ref(name)).toBe(true);
        state.append({formErrors: 'Error 1'});
        expect(state.ref(name)).toEqual(['Error 1']);
        state.append({formErrors: 'Error 2'});
        expect(state.ref(name)).toEqual(['Error 1', 'Error 2']);
    });
    it('busy', ()=>{
        const name = 'busy';
        const defaultValue = state.get(name);
        expect(defaultValue).toEqual(false);
        state.set({busy: defaultValue});
        expect(state.ref(name)).toEqual(false);
        expect(state.get(name)).toEqual(false);
        state.append({busy: true});
        expect(state.ref(name)).toEqual(true);
        expect(()=>state.append({busy: ''})).toThrow(Error);
    });
});

it('getContent', ()=>{    
    const storage = new TemporaryStorage();
    const state = new FormState(storage.push, storage.pull);
    const values = {'A': '1', 'B': '2'};
    const currentState = buildNewState(
        new FormFieldRules(new FormField('A'), new FormField('B')),
        values
    );
    storage.push(currentState);
    const content = state.getContent();
    expect(Object.keys(content).sort()).toEqual(Object.keys(currentState).sort());
    expect(content===currentState).toBe(false);
    expect(content.fieldRules===currentState.fieldRules).toBe(false);
    expect(content.values).toEqual(currentState.values);
    expect(content.values===currentState.values).toBe(false);
    expect(content.profiles===currentState.profiles).toBe(false);
    expect(content.formRules===currentState.formRules).toBe(false);
    expect(content.fieldErrors===currentState.fieldErrors).toBe(false);
    expect(content.formErrors===currentState.formErrors).toBe(false);
    expect(content.changedFields===currentState.changedFields).toBe(false);
    expect(content.busy).toEqual(currentState.busy);
});

it('getChangedFields', ()=>{
    const fieldRules = new FormFieldRules(new FormField('A'));
    const values = {'A': 5};
    const profile = ['A'];
    const formRules = new FormRules();
    const storage = new TemporaryStorage();
    storage.push(buildNewState(fieldRules, values, profile, formRules));
    const state = new FormState(storage.push, storage.pull);
    expect(state.getChangedFields()).toEqual([]);
    state.append({values: {'A': 3}});
    expect(state.getChangedFields()).toEqual(['A']);
    state.reset();
    expect(state.getChangedFields()).toEqual([]);
});

it('getDefaultValues', ()=>{
    const fieldRules = new FormFieldRules(new FormField('A'));
    const values = {'A': 5};
    const profile = ['A'];
    const formRules = new FormRules();
    const storage = new TemporaryStorage();
    storage.push(buildNewState(fieldRules, values, profile, formRules));
    const state = new FormState(storage.push, storage.pull);
    expect(state.getDefaultValues()).toEqual(values);
    expect(state.getDefaultValues()===values).toBe(false);
});

it('reset', ()=>{
    const storage = new TemporaryStorage();
    const state = new FormState(storage.push, storage.pull);
    const defaultValues = {'A': 1, 'B': 2};
    storage.push({defaultValues});
    state.reset();
    const newState = storage.getRef();
    expect(newState.values).toEqual(defaultValues);
    expect(newState.fieldErrors).toEqual({'A':[], 'B': []});
    expect(newState.changedFields).toEqual([]);
    expect(newState.formErrors).toEqual([]);
    expect(newState.busy).toEqual(false);
});
