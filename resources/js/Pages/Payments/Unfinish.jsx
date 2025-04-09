import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatRupiah } from '@/Utils/formatter';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

export default function Unfinish({ payment, package: pkg, landListing }) {
    return (
        <MainLayout>
            <Head title="Pembayaran Belum Selesai" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col items-center mb-6">
                                <ExclamationCircleIcon className="h-16 w-16 text-yellow-500 mb-4" />
                                <h1 className="text-2xl font-semibold">Pembayaran Belum Selesai</h1>
                                <p className="text-gray-600 mt-2">
                                    Anda belum menyelesaikan proses pembayaran. Silakan coba lagi.
                                </p>
                            </div>
                            
                            {payment && (
                                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                    <h2 className="text-lg font-medium mb-2">Detail Pembayaran</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">ID Pembayaran</p>
                                            <p className="font-medium">{payment.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Paket</p>
                                            <p className="font-medium">{pkg.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Harga</p>
                                            <p className="font-medium">{formatRupiah(payment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className="font-medium capitalize">{payment.status}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium text-yellow-800 mb-2">Apa yang harus saya lakukan?</h2>
                                <ul className="list-disc list-inside text-yellow-700 space-y-2">
                                    <li>Coba lakukan pembayaran kembali</li>
                                    <li>Pastikan Anda memiliki saldo yang cukup</li>
                                    <li>Periksa koneksi internet Anda</li>
                                    <li>Jika masalah berlanjut, hubungi customer service kami</li>
                                </ul>
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                                {payment && (
                                    <Link
                                        href={route('payments.process', payment.land_listing_id)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 focus:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Coba Lagi
                                    </Link>
                                )}
                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
