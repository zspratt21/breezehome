import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function FooterLink({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
            {children}
        </Link>
    );
}
