export default function HeaderHeading({text }: { text: string }) {
    return (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{text}</h2>
    );
}
