import {forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState, ChangeEvent} from 'react';
import PrimaryButton from "@/Components/PrimaryButton";

export interface ImageInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    initialPhoto: string | null;
    setPhotoData: (file: File | null) => void;
    setRemoveData: (value: 1 | 0) => void;
    removed: 1 | 0;
    previewAlt?: string;
    previewClassName?: string;
    current_file?: File | null;
}

export default forwardRef(function ImageInput(
    { className = '', current_file = null, isFocused = false, initialPhoto, removed = 0, setPhotoData, setRemoveData, previewAlt = '', previewClassName = '', ...props }: ImageInputProps,
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [imagePreviewSrc, setImagePreviewSrc] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                if (setPhotoData) {
                    setPhotoData(selectedFile);
                }
            } else {
                window.alert('Invalid file type. Please upload an image file.');
            }
        }
        e.target.value = '';
    };

    const handleRemoveClick = () => {
        if (current_file) {
            setPhotoData(null);
        } else {
            setRemoveData(removed === 1 ? 0 : 1);
        }
    };

    useEffect(() => {
        if (current_file) {
            setImagePreviewSrc(URL.createObjectURL(current_file));
            if (removed == 1) {
                setRemoveData(0);
            }
        } else if (initialPhoto) {
            setImagePreviewSrc(initialPhoto);
        } else {
            setImagePreviewSrc('');
        }
    }, [current_file, initialPhoto]);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        click: () => {
            if (localRef.current) {
                localRef.current.click();
            }
        }
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className={className}>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                name={props.id}
                onChange={handleInputChange}
                {...props}
                ref={localRef}
            />

            <div className="w-full flex space-x-1">

                <PrimaryButton
                    className="flex-1"
                    onClick={(e) => {
                        e.preventDefault();
                        if (localRef.current) {
                            localRef.current.click();
                        }
                    }}
                >&#xf055; Add</PrimaryButton>

                <PrimaryButton
                    className="flex-1"
                    disabled={initialPhoto === null && !current_file}
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemoveClick();
                    }}
                >&#xf057; Remove</PrimaryButton>

            </div>

            <div className="mt-2 relative w-fit">
                {removed && (
                    <div className={`bg-gray-900/80 w-full h-full z-10 absolute border-1 border-gray-100`}>
                        <div className="flex flex-col items-center justify-center h-full text-gray-100 text-6xl">
                            &#xf057;
                        </div>
                    </div>
                ) || null}
                <div>
                    {initialPhoto === null && !current_file && (
                        <div className="w-full my-auto">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-2xl">No image</div>
                                <div className="text-sm">Click Add to upload an image</div>
                            </div>
                        </div>
                    ) || (
                        <img
                            className={`${previewClassName}`}
                            src={imagePreviewSrc}
                            alt={previewAlt}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});
