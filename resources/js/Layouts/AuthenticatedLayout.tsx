import { PropsWithChildren, ReactNode } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { User } from '@/types';
import MainLayout from './MainLayout';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {
    const navigationLinks = (
        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
            Dashboard
        </NavLink>
    );

    const dropdownContent = (
        <div className="ms-3 relative my-auto">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                        >
                            {user.avatar && (
                                <img
                                    className="h-10 w-10 rounded-full mr-2 border-2 border-gray-700 dark:border-gray-300"
                                    src={user.avatar}
                                    alt="User Avatar photo"
                                />
                            )}
                            {user.name}
                            &nbsp;
                            &#xf078;
                        </button>
                    </span>
                </Dropdown.Trigger>
                <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>&#xf007; &nbsp; Profile</Dropdown.Link>
                    {user.id == 1 && (
                        <Dropdown.Link href={route('php-info')} target="_blank">&#xf233; &nbsp; PHP Info</Dropdown.Link>
                    )}
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                        &#xf2f5; &nbsp; Log Out
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );

    return (
        <MainLayout
            user={user}
            header={header}
            navigationLinks={navigationLinks}
            dropdownContent={dropdownContent}
        >
            {children}
        </MainLayout>
    );
}
