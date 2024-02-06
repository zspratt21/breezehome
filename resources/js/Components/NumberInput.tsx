import TextInput from './TextInput';
import { InputHTMLAttributes } from 'react';

export default function NumberInput(props: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean }) {
    return (
        <TextInput
            {...props}
            onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter' && e.key !== 'Tab') {
                    e.preventDefault();
                }
            }}
        />
    );
};
