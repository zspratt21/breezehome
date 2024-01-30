import {useState, useEffect, ButtonHTMLAttributes} from 'react';

export default function DarkModeToggle(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('color-theme', newMode ? 'dark' : 'light');
            toggleClass();
            return newMode;
        });
    };

    function toggleClass() {
        if (
            localStorage.getItem('color-theme') === 'dark' ||
            (!('color-theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    useEffect(() => {
        const storedTheme = localStorage.getItem('color-theme');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(storedTheme === 'dark' || (!storedTheme && prefersDarkMode));
        toggleClass();
    }, []);

    return (
        <button
            onClick={toggleDarkMode}
            type="button"
            className={`theme-toggle ${props.className}`}
            {...props}
        >
            <span className="fas">
                {isDarkMode ? (
                    <>&#xf186;</>
                ) : (
                    <>&#xf185;</>
                )}
            </span>
        </button>
    );
};
