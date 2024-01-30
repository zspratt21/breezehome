import {useState} from "react";

export interface RecoveryCodeProps {
    recoveryCodes: string[];
}
export default function RecoveryCodes({recoveryCodes}: RecoveryCodeProps) {
    const [codes, setCodes] = useState(recoveryCodes as string[] | null);
    const copyCodes = (recoveryCodes: string[]) => {
        navigator.clipboard.writeText(recoveryCodes.join('\n')).then(() => {
            alert('The recovery codes have been copied to your clipboard.');
            setCodes(null);
        });
    }

    return (
        <>
            {codes && (
                <div className="mt-4">
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        These single use codes may be used in the event you lose access to your device.
                    </p>
                    <div
                        className="flex bg-gray-100 dark:bg-gray-700 p-2 sm:rounded-lg text-gray-600 dark:text-gray-400">
                        <ul className="flex-1">
                            {codes.map((code) => (
                                <li key={code}>{code}</li>
                            ))}
                        </ul>
                        <a className="fas h-fit align-top cursor-pointer" onClick={() => {
                            copyCodes(recoveryCodes)
                        }}>&#xf0c5;</a>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Once all codes have been
                        used, we will generate more for you upon your next login.</p>
                </div>
            )}
        </>
    )
}
