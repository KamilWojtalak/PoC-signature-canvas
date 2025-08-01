import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

interface SignatureData {
    id: number;
    url: string;
    created_at: string;
}

interface PageProps {
    signature: SignatureData;
}

export default function Show() {
    const { signature } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Signature #${signature.id}`} />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 text-center">
                     <h1 className="text-2xl font-bold mb-2">Signature #{signature.id}</h1>
                     <p className="text-sm text-gray-500 mb-6">Created: {signature.created_at}</p>

                     <div className="p-4 border rounded-md">
                        <img
                            src={signature.url}
                            alt={`Signature ${signature.id}`}
                            className="w-full h-auto object-contain"
                        />
                     </div>

                     <Link
                        href={route('signatures.index')}
                        className="mt-8 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                     >
                        Back to List
                     </Link>
                </div>
            </div>
        </>
    );
}
