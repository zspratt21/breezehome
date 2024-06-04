import { FormEventHandler, useState } from 'react';
import axios from 'axios';

interface SearchComponentProps {
    placeholder: string;
    searchUrl: string;
    refreshResults: (r: []) => void;
}

export default function SearchComponent({ placeholder, searchUrl, refreshResults }: SearchComponentProps) {
    const [query, setQuery] = useState('');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        axios.get(searchUrl, { params: { query } }).then((response) => {
            refreshResults(response.data);
        }).catch((error) => {
            console.error('Search error:', error);
        });
    };

    return (
        <div>
            <form onSubmit={submit} className="relative">
                <input
                    className="w-full rounded-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 shadow-sm"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                />
                <button className="px-4 absolute right-0 h-full" type="submit">&#xf002;</button>
            </form>
        </div>
    );
}
