import {PropsWithChildren} from "react";

export default function FullPageForm({ children }: PropsWithChildren) {
    return (
        <div className="w-full mx-auto my-auto sm:max-w-md px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
            {children}
        </div>
    );
}
