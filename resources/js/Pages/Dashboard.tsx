import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import HeaderHeading from '@/Components/HeaderHeading';
import SearchComponent from '@/Components/SearchInput';
import RecoveryCodes, { RecoveryCodeProps } from '@/Pages/Auth/RecoveryCodes';

interface DashboardProps extends PageProps, RecoveryCodeProps {}

export default function Dashboard({ auth, recoveryCodes }: DashboardProps) {
    const [userSearchResults, setUserSearchResults] = useState([]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<HeaderHeading text="Dashboard" />}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {'You\'re logged in!'}
                            {recoveryCodes && (
                                ' You just used your last recovery code, so we\'ve generated some more for you.'
                            )}
                        </div>
                        {recoveryCodes && (
                            <div className="px-6 pb-6">
                                <RecoveryCodes recoveryCodes={recoveryCodes} />
                            </div>

                        )}
                    </div>

                    <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <SearchComponent
                                placeholder="Search for fellow users..."
                                searchUrl="/api/search/users"
                                refreshResults={(r: []) => {
                                    setUserSearchResults(r);
                                }}
                            />
                            <div className="mt-6">
                                {userSearchResults.map((user: User, idx) => (
                                    <div key={idx}>
                                        {user.name}
                                        {' '}
                                        -
                                        {' '}
                                        {user.email}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
