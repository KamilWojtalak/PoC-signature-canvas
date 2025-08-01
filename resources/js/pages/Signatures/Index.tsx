import { Head, Link, usePage } from '@inertiajs/react';

interface Signature {
    id: number;
    url: string;
    created_at: string;
}

interface PageProps {
    signatures: Signature[];
    flash?: {
        success?: string;
    };
}

export default function Index() {
    const { signatures, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="All signatures" />
            <div className="min-h-screen bg-gray-100 text-gray-800">
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Signatures</h1>
                        <Link
                            href={route('signatures.create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Add New Signature
                        </Link>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
                            {flash.success}
                        </div>
                    )}

                    {signatures.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {signatures.map((signature) => (
                                <div key={signature.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                    <div className="p-4 border-b">
                                        <img
                                            src={signature.url}
                                            alt={`Podpis ${signature.id}`}
                                            className="w-full h-32 object-contain"
                                        />
                                    </div>
                                    <div className="p-4 bg-gray-50">
                                        <p className="text-sm text-gray-500 mb-2">Added: {signature.created_at}</p>
                                        <div className="flex justify-between items-center">
                                            <Link
                                                href={route('signatures.show', signature.id)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Show
                                            </Link>
                                            <Link
                                                href={route('signatures.destroy', signature.id)}
                                                method="delete"
                                                as="button"
                                                className="text-sm text-red-600 hover:underline"
                                                onBefore={() => confirm('Are you sure you want to delete this signature?')}
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500">No signatures.</p>
                            <p className="mt-2 text-gray-500">Click the button above to add the first one.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
