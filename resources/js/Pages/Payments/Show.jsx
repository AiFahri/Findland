import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatRupiah } from '@/Utils/formatter';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon, 
    ExclamationCircleIcon 
} from '@heroicons/react/solid';

export default function Show({ payment, package: pkg, landListing }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
            case 'unpaid':
                return <ClockIcon className="h-8 w-8 text-yellow-500" />;
            case 'pending':
                return <ClockIcon className="h-8 w-8 text-blue-500" />;
            case 'expired':
                return <ExclamationCircleIcon className="h-8 w-8 text-gray-500" />;
            case 'failed':
            case 'denied':
                return <XCircleIcon className="h-8 w-8 text-red-500" />;
            default:
                return <ClockIcon className="h-8 w-8 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Dibayar';
            case 'unpaid':
                return 'Belum Dibayar';
            case 'pending':
                return 'Menunggu';
            case 'expired':
                return 'Kadaluarsa';
            case 'failed':
                return 'Gagal';
            case 'denied':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'text-green-700';
            case 'unpaid':
                return 'text-yellow-700';
            case 'pending':
                return 'text-blue-700';
            case 'expired':
                return 'text-gray-700';
            case 'failed':
            case 'denied':
                return 'text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <MainLayout>
            <Head title="Detail Pembayaran" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Detail Pembayaran</h1>
                                <Link
                                    href={route('payments.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Kembali
                                </Link>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                {getStatusIcon(payment.status)}
                                <span className={`ml-2 text-lg font-semibold ${getStatusColor(payment.status)}`}>
                                    {getStatusText(payment.status)}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium mb-4">Informasi Pembayaran</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">ID Pembayaran</p>
                                            <p className="font-medium">{payment.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tanggal Pembuatan</p>
                                            <p className="font-medium">{formatDate(payment.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                                            <p className="font-medium">{formatDate(payment.paid_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Metode Pembayaran</p>
                                            <p className="font-medium capitalize">{payment.payment_type || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium mb-4">Detail Paket</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Nama Paket</p>
                                            <p className="font-medium">{pkg.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Harga</p>
                                            <p className="font-medium">{formatRupiah(payment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Durasi</p>
                                            <p className="font-medium">{pkg.duration} bulan</p>
                                        </div>
                                        {landListing.expiry_date && (
                                            <div>
                                                <p className="text-sm text-gray-600">Tanggal Kedaluwarsa</p>
                                                <p className="font-medium">{formatDate(landListing.expiry_date)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium mb-4">Informasi Listing Tanah</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nama Pemilik</p>
                                        <p className="font-medium">{landListing.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nomor KTP</p>
                                        <p className="font-medium">{landListing.ktp_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nomor Telepon</p>
                                        <p className="font-medium">{landListing.phone_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status Admin</p>
                                        <p className="font-medium capitalize">{landListing.admin_status}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {payment.status === 'unpaid' && (
                                <div className="flex justify-center">
                                    <Link
                                        href={route('payments.process', payment.land_listing_id)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 focus:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Lanjutkan Pembayaran
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
