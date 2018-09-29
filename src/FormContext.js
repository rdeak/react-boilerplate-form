import React from 'react';
import FormTemplate from './FormTemplate';
import TemporaryStorage from './storages/TemporaryStorage';

export const createNewContextValue = () => {
    const storage = new TemporaryStorage();
    const template = new FormTemplate(storage.push, storage.pull);
    return {template, token: Math.random()};
};
const FormTemplateContext = React.createContext(createNewContextValue());
export default FormTemplateContext;