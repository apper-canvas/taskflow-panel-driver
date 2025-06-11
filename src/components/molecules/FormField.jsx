import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({ label, type = 'text', children, className = '', ...props }) => {
    const id = props.id || label.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
    let InputComponent;

    switch (type) {
        case 'select':
            InputComponent = Select;
            break;
        case 'textarea':
            InputComponent = TextArea;
            break;
        default:
            InputComponent = Input;
    }

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {props.required && '*'}
            </label>
            <InputComponent id={id} type={type} {...props}>
                {children}
            </InputComponent>
        </div>
    );
};

export default FormField;