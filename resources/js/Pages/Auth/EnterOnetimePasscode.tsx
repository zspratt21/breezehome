import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import HeaderHeading from '@/Components/HeaderHeading';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import FullPageForm from '@/Components/FullPageForm';
import PrimaryButton from '@/Components/PrimaryButton';
import NumberInput from '@/Components/NumberInput';
import InputError from '@/Components/InputError';

export default function EnterOnetimePasscode({}) {
    const {
        data, setData, post, processing, errors, reset,
    } = useForm({
        code: '',
        isRecovery: null as true | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('2fa.check'));
    };

    useEffect(() => {
        setData('code', '');
    }, [data.isRecovery]);

    return (
        <GuestLayout
            header={<HeaderHeading text="2FA" />}
        >
            <FullPageForm>
                <form onSubmit={submit}>
                    {data.isRecovery == null ? (
                        <>
                            <NumberInput
                                placeholder="&#xe2c5; Enter the code from your authenticator app"
                                id="code"
                                maxLength={6}
                                minLength={6}
                                name="code"
                                className="mt-1 block w-full"
                                value={data.code}
                                required
                                autoComplete="off"
                                onChange={(e) => setData('code', e.target.value)}
                                isFocused
                            />
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Can't access authenticator app?&nbsp;
                                <a
                                    className="underline cursor-pointer"
                                    onClick={() => {
                                        setData('isRecovery', true);
                                    }}
                                >
                                    Enter a recovery code instead.
                                </a>
                            </p>
                        </>
                    ) : (
                        <>
                            <TextInput
                                placeholder="&#xf084; Enter a recovery code"
                                id="code"
                                name="code"
                                maxLength={16}
                                minLength={16}
                                className="mt-1 block w-full"
                                value={data.code}
                                required
                                autoComplete="off"
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                <a
                                    className="underline cursor-pointer"
                                    onClick={() => {
                                        setData('isRecovery', null);
                                    }}
                                >
                                    Go back.
                                </a>
                            </p>
                        </>

                    )}
                    <InputError message={errors.code} className="mt-2" />
                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton type="submit" className="ms-4" disabled={processing}>
                            &#xf2f6; Continue
                        </PrimaryButton>
                    </div>
                </form>
            </FullPageForm>
        </GuestLayout>
    );
}
