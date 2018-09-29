import TemporaryStorage from './TemporaryStorage';

it('creates a new instance', ()=>{
    expect(new TemporaryStorage()).toBeInstanceOf(TemporaryStorage);
});

it('pull & push', ()=>{
    const storage = new TemporaryStorage();
    const values = {a: 1, b: 2};
    storage.push(values);
    expect(storage.pull('a')).toEqual(1);
    expect(storage.pull('b')).toEqual(2);
    expect(storage.getRef()).toEqual(values);
    expect(storage.getRef()===values).toBe(false);
});

it('one value push', ()=>{
    const storage = new TemporaryStorage();
    const values = {a: 1, b: 2};
    const newValues = {a: 2, b: 2};
    storage.push(values);
    storage.push({a: 2});
    expect(storage.pull('a')).toEqual(2);
    expect(storage.pull('b')).toEqual(2);
    expect(storage.getRef()).toEqual(newValues);
});