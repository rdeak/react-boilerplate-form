[![Build Status](https://travis-ci.org/rdeak/react-boilerplate-form.svg?branch=master)](https://travis-ci.org/rdeak/react-boilerplate-form)
[![Coverage Status](https://coveralls.io/repos/github/rdeak/react-boilerplate-form/badge.svg?branch=master)](https://coveralls.io/github/rdeak/react-boilerplate-form?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=react-boilerplate-form)](https://packagephobia.now.sh/result?p=react-boilerplate-form)

# React-boilerplate-form

React-boilerplate-form is tiny library that provides boilerplate form components and validators for ReactJS.
Main goal of this library is to separate business logic from UI and keep it pure and clean. 

Library provides common form elements (e.g. Input, Form, Select) and few specific (Errors, Profile) as React components. 
Additional functionalities  (e.g. isDirty, isValid, isBusy) are available when Form component is used as [FaaC](https://reactjs.org/docs/jsx-in-depth.html#functions-as-children).
Components do not have any styling. Hence, classes and styles should be applied to them as to any other React components.

Also, many custom sync or async validators for complete form or particular field can be defined although basic set of rules are provided (e.g. min, max, greater, least, size, required).

## Main features

* Expressive and intuitive syntax
* Custom field validation rules (sync and async)
* Custom form validation rules (sync and async)
* Custom field value decorators
* React components that match common HTML form tags
* Support for different profiles (e.g. insert, update)

## Install

Install it with NPM

```
npm install react-boilerplate-form --save
```

## Prerequisites

* ReactJS 16.4+

## Usage

Form should be defined in two steps:

1. define rules (validations and decorators) for form fields 
```javascript
    const fieldset = new FormFieldset(new TextFormField('firstname').min(3));
```
2. create UI
```html
    <form fields={fieldset} onSubmit={(values)=>console.log(values)}>
        <Input name="firstname" />
        <button type="submit">Submit</button>
    </form>
```

### Complete example:

```jsx
import React from 'react';
import {FormFieldRules, FormRules, TextFormField, NumberFormField, Form, Input} from 'react-boilerplate-form';

function SimpleForm(){
    
    const fieldRules = new FormFieldRules(
        new NumberFormField('id'),
        new TextFormField('title')
    );
    const formRules = new FormRules();

    const onSubmit = values=>console.log(values);
    const initalValues = {'id': 1};

    return (
        <Form fieldRules={fieldRules} values={initalValues} onSubmit={onSubmit}>
            <label htmlFor="id">ID:</label>
            <Input name="id" />
            <label htmlFor="title">Title:</label>
            <Input name="title" />
            <button type="submit">Submit</button>
        </Form>
    );
}
export default SimpleForm;
```

### Form as FaaC example:

```jsx
import React from 'react';
import {FormFieldRules, FormRules, TextFormField, NumberFormField, Form, Input} from 'react-boilerplate-form';

function SimpleForm(){
    
    const fieldRules = new FormFieldRules(
        new TextFormField('firstname'),
        new NumberFormField('age')
    );

    const onSubmit = values=>console.log(values);
    const initalValues = {'age': 18};

    return (
        <Form fieldRules={fieldRules} values={initalValues} onSubmit={onSubmit}>{
            ({isDirty})=>(
                <React.Fragment>
                    <label htmlFor="firstname">Firstname:{isDirty('firstname') && <small>changed</small>}</label>
                    <Input name="firstname" />
                    <label htmlFor="age">Age:{isDirty('age') && <small>changed</small>}</label>
                    <Input name="age" />
                    <button type="submit">Submit</button>
                </React.Fragment>
            )
        }
        </Form>
    );
}
```

Please go on [wiki]() for more examples and complete API.

## License

[MIT](https://tldrlegal.com/license/mit-license)

