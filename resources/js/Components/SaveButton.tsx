import { ButtonHTMLAttributes } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SaveButton({
    type = 'button', className = '', disabled, children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <PrimaryButton
            {...props}
            className={className}
        >
            <b className="fas">&#xf0c7;</b>
&nbsp;Save
        </PrimaryButton>
    );
}
