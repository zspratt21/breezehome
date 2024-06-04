import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import FullPageForm from '@/Components/FullPageForm';
import HeaderHeading from '@/Components/HeaderHeading';

export default function ForgotPassword({ status }: { status?: string }) {
    const {
        data, setData, post, processing, errors,
    } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout header={<HeaderHeading text="Forgotten Password" />}>
            <Head title="Forgot Password" />
            <FullPageForm>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Forgot your password? No problem. Just let us know your email address and we will email you a password
                    reset link that will allow you to choose a new one.
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

                <form onSubmit={submit}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="&#xf0e0; Email"
                        className="mt-1 block w-full"
                        isFocused
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            &#xf1d8; Send Password Reset Link
                        </PrimaryButton>
                    </div>
                </form>
            </FullPageForm>
        </GuestLayout>
    );
}
