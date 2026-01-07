import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { formatRupiah } from "@/Utils/formatter";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/solid";

export default function Index({ payments }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case "paid":
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case "unpaid":
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case "pending":
                return <ClockIcon className="h-5 w-5 text-blue-500" />;
            case "expired":
                return (
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />
                );
            case "failed":
            case "denied":
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusTextClass = (status) => {
        switch (status) {
            case "paid":
                return "text-green-700 bg-green-100";
            case "unpaid":
                return "text-yellow-700 bg-yellow-100";
            case "pending":
                return "text-blue-700 bg-blue-100";
            case "expired":
                return "text-gray-700 bg-gray-100";
            case "failed":
            case "denied":
                return "text-red-700 bg-red-100";
            default:
                return "text-gray-700 bg-gray-100";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <MainLayout>
            <Head title="Riwayat Pembayaran" />
            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">
                                Riwayat Pembayaran
                            </h1>

                            {payments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Anda belum memiliki riwayat pembayaran.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    ID Pembayaran
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Paket
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Jumlah
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Tanggal
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payment.id.substring(
                                                            0,
                                                            8
                                                        )}
                                                        ...
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {payment.package.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatRupiah(
                                                            payment.amount
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(
                                                            payment.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(
                                                                payment.status
                                                            )}
                                                            <span
                                                                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusTextClass(
                                                                    payment.status
                                                                )}`}
                                                            >
                                                                {payment.status ===
                                                                "paid"
                                                                    ? "Dibayar"
                                                                    : payment.status ===
                                                                      "unpaid"
                                                                    ? "Belum Dibayar"
                                                                    : payment.status ===
                                                                      "pending"
                                                                    ? "Menunggu"
                                                                    : payment.status ===
                                                                      "expired"
                                                                    ? "Kadaluarsa"
                                                                    : payment.status ===
                                                                      "failed"
                                                                    ? "Gagal"
                                                                    : payment.status ===
                                                                      "denied"
                                                                    ? "Ditolak"
                                                                    : payment.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "payments.show",
                                                                payment.id
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Detail
                                                        </Link>
                                                        {payment.status ===
                                                            "unpaid" && (
                                                            <Link
                                                                href={route(
                                                                    "payments.process",
                                                                    payment.land_listing_id
                                                                )}
                                                                className="ml-4 text-green-600 hover:text-green-900"
                                                            >
                                                                Bayar
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
