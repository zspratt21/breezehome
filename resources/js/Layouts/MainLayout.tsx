import {PropsWithChildren, ReactNode, useState} from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {Link, router} from '@inertiajs/react';
import FooterLink from "@/Components/FooterLink";
import DarkModeToggle from "@/Components/DarkModeToggle";
import {render} from "react-dom";

type MainLayoutProps = {
    user?: { name: string, email: string };
    header?: ReactNode;
    children: ReactNode;
    navigationLinks: ReactNode;
    dropdownContent?: ReactNode;
};

export default function MainLayout({ user, header, children, navigationLinks, dropdownContent }: PropsWithChildren<MainLayoutProps>) {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 space-x-6 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo
                                        className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"/>
                                </Link>
                                <DarkModeToggle
                                    className="text-white dark:text-gray-800 bg-gray-400 dark:bg-gray-500 p-1 w-8 h-8 rounded-full"/>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {navigationLinks}
                            </div>
                        </div>
                        <div className="flex">
                            {user && dropdownContent}
                            <div className="sm:hidden my-auto">
                                <button onClick={toggleMobileMenu} className="text-gray-800 dark:text-gray-200 text-2xl">&#xf0c9;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-full mx-auto flex flex-col flex-1 relative">
                { mobileMenuOpen && (
                    <div className="bg-white dark:bg-gray-800 flex flex-col px-2 z-10 absolute w-full h-full">
                        {navigationLinks}
                    </div>
                )}
                {(header) && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}
                {children}
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-col">
                    <div className="flex justify-between my-auto">
                        <FooterLink href="https://github.com/zspratt21">&#xf1f9; {new Date().getFullYear()} Zspratt21</FooterLink>
                        <FooterLink href="https://github.com/zspratt21/breezehome">Breezehome &#xf015; Starter Template</FooterLink>
                    </div>
                </div>
            </footer>
        </div>
    );
}
