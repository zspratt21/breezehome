import { PropsWithChildren, ReactNode } from 'react';
import NavLink from '@/Components/NavLink';
import MainLayout from './MainLayout';

export default function Guest({ children, header = null }: PropsWithChildren<{header?: ReactNode}>) {
    const navigationLinks = (
        <>
            <NavLink href="/login" active={route().current('login')}>Login</NavLink>
            <NavLink href="/register" active={route().current('register')}>Register</NavLink>
        </>
    );

    return (
        <MainLayout
            navigationLinks={navigationLinks}
            header={header}
        >
            {children}
        </MainLayout>
    );
}
