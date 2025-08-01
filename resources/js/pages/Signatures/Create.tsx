import React, { useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

export default function Create() {
    const sigPadRef = useRef<SignatureCanvas>(null);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ signature?: string }>({});

    const clear = () => {
        sigPadRef.current?.clear();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (sigPadRef.current?.isEmpty()) {
            alert('Please provide a signature before saving.');
            return;
        }

        const signatureData = sigPadRef.current?.toDataURL('image/png');

        setProcessing(true);
        setErrors({});

        axios.post(route('signatures.store'), { signature: signatureData })
            .then(response => {
                router.visit(route('signatures.index'));
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error("An unexpected error occurred:", error);
                    alert('An unexpected error occurred. Please try again.');
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    return (
        <>
            <Head title="New Signature" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-4">Create Your Signature</h1>
                    <div className="border-2 border-dashed rounded-md bg-gray-50">
                        <SignatureCanvas
                            ref={sigPadRef}
                            penColor="black"
                            canvasProps={{
                                className: 'w-full h-64 sig-canvas',
                            }}
                        />
                    </div>
                    {errors.signature && <div className="text-red-500 mt-2 text-center">{errors.signature}</div>}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={clear}
                            type="button"
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-green-300"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
