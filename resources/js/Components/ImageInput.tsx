import {forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState, ChangeEvent} from 'react';
import PrimaryButton from "@/Components/PrimaryButton";

interface ImageInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    initialPhoto: string | null;
    setPhotoData: (file: File | null) => void;
    setRemoveData: (value: 1 | 0) => void;
    previewClassName?: string;
    previewHeight?: string;
    previewWidth?: string;
}

export default forwardRef(function ImageInput(
    { className = '', isFocused = false, initialPhoto, setPhotoData, setRemoveData, previewClassName = '', previewHeight = '', previewWidth = '', ...props }: ImageInputProps,
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [remove, setRemove] = useState<1 | 0>(0);
    const [hasFiles, setHasFiles] = useState(false);
    const [imagePreviewSrc, setImagePreviewSrc] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setImagePreviewSrc(URL.createObjectURL(selectedFile));
            setHasFiles(true);
            if (remove == 1) {
                setRemove(0);
            }
            if (setPhotoData) {
                setPhotoData(selectedFile);
            }
        }
    };

    useEffect(() => {
        setImagePreviewSrc(initialPhoto || '');
    }, [initialPhoto]);

    const handleRemoveClick = () => {
        if (hasFiles) {
            if (localRef.current) {
                localRef.current.value = '';
            }
            setImagePreviewSrc(initialPhoto || '');
            setHasFiles(false);
            setPhotoData(null);
        } else {
            const removeUpdate = remove == 1 ? 0 : 1;
            setRemove(removeUpdate);
        }
    };

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        click: () => {
            if (localRef.current) {
                localRef.current.click();
            }
        }
    }));

    useEffect(() => {
        setRemoveData(remove);
    }, [remove]);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);


    return (
        <div className={className}>

            <input
                type="file"
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
                    disabled={initialPhoto === null && !hasFiles}
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemoveClick();
                    }}
                >&#xf057; Remove</PrimaryButton>

            </div>

            <div className="mt-2 relative w-fit">
                <div className={`bg-gray-900/80 w-full h-full z-10 absolute border-1 border-gray-100 ${previewClassName}`}
                     style={{display: remove ? 'block' : 'none'}}
                >
                    <div className="flex flex-col items-center justify-center h-full text-gray-100 text-6xl">
                        &#xf057;
                    </div>
                </div>
                <div>
                    <img id={props.id + '-preview'}
                         className={previewClassName}
                         src={imagePreviewSrc}
                         alt={props.alt}
                         style={{display: initialPhoto == null && !hasFiles ? 'none' : 'block', height: previewHeight == '' ? 'inherit' : previewHeight, width: previewWidth == '' ? 'inherit' : previewWidth}}
                    />
                    <div className="w-full my-auto"
                         style={{display: initialPhoto == null && !hasFiles ? 'block' : 'none'}}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-2xl">No image</div>
                            <div className="text-sm">Click Add to upload an image</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
