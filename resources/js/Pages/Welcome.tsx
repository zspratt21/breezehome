import { Head } from '@inertiajs/react';
import {PageProps, User} from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import WelcomeCard from "@/Components/WelcomeCard";

export default function Welcome({ user, auth, laravelVersion, phpVersion }: PageProps<{ user: User, laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />
            {auth.user ? (
                <AuthenticatedLayout
                    user={auth.user}
                >
                    <div className="flex flex-col my-auto">
                        <WelcomeCard laravelVersion={laravelVersion} phpVersion={phpVersion} />
                    </div>
                </AuthenticatedLayout>
            ) : (
                <GuestLayout>
                    <div className="flex flex-col my-auto">
                        <WelcomeCard laravelVersion={laravelVersion} phpVersion={phpVersion} />
                    </div>
                </GuestLayout>
            )}
        </>
    );
}
