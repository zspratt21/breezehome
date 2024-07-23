import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler, useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { PageProps } from '@/types';
import SaveButton from '@/Components/SaveButton';
import ImageInput from '@/Components/ImageInput';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: { mustVerifyEmail: boolean, status?: string, className?: string }) {
    const { user } = usePage<PageProps>().props.auth;
    const {
        data, setData, post, errors, processing, recentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
        file_avatar: null as File | null,
        remove_avatar: 0 as 1 | 0,
        _method: 'patch',
    });
    const [refreshKey, setRefreshKey] = useState(0);
    const imageInputRef = useRef(null);
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(
            route('profile.update'),
            {
                onSuccess: (Page) => {
                    console.log('onSuccess', Page);
                    setRefreshKey(refreshKey + 1);
                    setData('file_avatar', null);
                    setData('remove_avatar', 0);
                },
            },
        );
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" key={refreshKey}>
                <input type="hidden" name="_method" value="patch" />
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="&#xf007;"
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="&#xf0e0;"
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="file_avatar" value="Profile Photo" />

                    <ImageInput
                        ref={imageInputRef}
                        className="mt-1 block w-full"
                        initialPhoto={user.avatar}
                        current_file={data.file_avatar}
                        setPhotoData={(photo: File | null) => setData('file_avatar', photo)}
                        setRemoveData={(value: 0 | 1) => setData('remove_avatar', value)}
                        id="file_avatar"
                        previewAlt="Profile Photo"
                        previewClassName="h-66 w-auto"
                        removed={data.remove_avatar}
                    />

                    <InputError className="mt-2" message={errors.file_avatar} />
                </div>

                <div className="flex items-center gap-4">
                    <SaveButton disabled={processing} />

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
