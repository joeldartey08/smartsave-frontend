import { useState } from "react";
import { ImageUp, XCircle } from "lucide-react";

export default function ProofImageUpload({ value, onChange }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file)
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null)
    };

    return (
        <div className="w-full">
            <label className="block text-text font-normal mb-1">
                Proof of Payment:
            </label>

            {!preview ? (
                <label
                    htmlFor="proofImage"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >
                    <ImageUp className="text-blue-500 mb-2" size={40} />
                    <p className="text-gray-500 text-sm">
                        Click or drag to upload proof image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        (Max: 2MB • JPG, PNG)
                    </p>
                    <input
                        id="proofImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm">
                    <img
                        src={preview}
                        alt="Proof Preview"
                        className="object-cover w-full h-full"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    >
                        <XCircle className="text-red-500" size={22} />
                    </button>
                </div>
            )}
        </div>
    );
}
