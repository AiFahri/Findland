import { useEffect, useState, useRef } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { formatRupiah } from "@/Utils/formatter";
import axios from "axios";

export default function DirectPayment({
    payment,
    package: pkg,
    landListing,
    paymentData,
    clientKey,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snapInitialized, setSnapInitialized] = useState(false);
    const midtransRetryCount = useRef(0);
    const maxRetries = 3;

    const retryMidtransLoad = () => {
        if (midtransRetryCount.current >= maxRetries) {
            setError(
                "Gagal memuat Midtrans setelah beberapa percobaan. Silakan refresh halaman ini."
            );
            return;
        }

        midtransRetryCount.current += 1;
        loadMidtransScript();
    };

    useEffect(() => {
        const loadMidtransScript = () => {
            setIsLoading(true);
            const script = document.createElement("script");
            script.src = paymentData.is_production
                ? "https://app.midtrans.com/snap/snap.js"
                : "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute("data-client-key", clientKey);
            script.async = true;
            script.defer = true; 

            script.onload = () => {
                setIsLoading(false);
                setSnapInitialized(true);
            };

            script.onerror = () => {
                setIsLoading(false);
                setError("Gagal memuat Midtrans. Silakan refresh halaman ini.");
            };

            document.body.appendChild(script);

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        };

        loadMidtransScript();
    }, [paymentData, clientKey]);

    const handlePayButtonClick = () => {
        if (!snapInitialized) {
            setError("Midtrans belum dimuat. Silakan refresh halaman ini.");
            return;
        }

        setIsLoading(true);

        try {
            const transactionDetails = {
                transaction_details: {
                    order_id: paymentData.order_id,
                    gross_amount: paymentData.gross_amount,
                },
                customer_details: {
                    first_name: paymentData.first_name,
                    last_name: paymentData.last_name,
                    email: paymentData.email,
                    phone: paymentData.phone,
                },
                item_details: [
                    {
                        id: paymentData.item_id,
                        price: paymentData.item_price,
                        quantity: 1,
                        name: paymentData.item_name,
                    },
                ],
                callbacks: {
                    finish: paymentData.finish_url,
                    unfinish: paymentData.unfinish_url,
                    error: paymentData.error_url,
                },
                credit_card: {
                    secure: true,
                },
            };

            axios
                .post("/api/payments/get-snap-token", {
                    order_id: paymentData.order_id,
                    transaction_data: transactionDetails,
                })
                .then((response) => {
                    const snapToken = response.data.snap_token;
                    if (!snapToken) {
                        throw new Error("Failed to get Snap Token from server");
                    }

                    // Tambahkan opsi tambahan untuk production
                    const snapOptions = {
                        skipOrderSummary: false,
                        showOrderId: true,
                        onSuccess: function (result) {
                            console.log("Payment success:", result);
                            updatePaymentStatus("success", result);
                            window.location.href = paymentData.finish_url;
                        },
                        onPending: function (result) {
                            console.log("Payment pending:", result);
                            updatePaymentStatus("pending", result);
                            window.location.href = paymentData.unfinish_url;
                        },
                        onError: function (result) {
                            console.log("Payment error:", result);
                            updatePaymentStatus("failed", result);
                            window.location.href = paymentData.error_url;
                        },
                        onClose: function () {
                            console.log(
                                "Customer closed the popup without finishing payment"
                            );
                            setIsLoading(false);
                        },
                    };

                    window.snap.pay(snapToken, snapOptions);
                })
                .catch((error) => {
                    console.error("Error getting snap token:", error);
                    setError(
                        "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi."
                    );
                    setIsLoading(false);
                });
        } catch (error) {
            console.error("Error in payment process:", error);
            setError(
                "Terjadi kesalahan saat membuka popup pembayaran. Silakan coba lagi."
            );
            setIsLoading(false);
        }
    };

    const updatePaymentStatus = async (status, result) => {
        try {
            await axios.post("/api/payments/update-status", {
                order_id: paymentData.order_id,
                status: status,
                transaction_id: result?.transaction_id || null,
                payment_type: result?.payment_type || null,
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };

    return (
        <MainLayout>
            <Head title="Pembayaran Langsung" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-4">
                                Pembayaran Listing Tanah
                            </h1>

                            {error && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                                    role="alert"
                                >
                                    <strong className="font-bold">
                                        Error!
                                    </strong>
                                    <span className="block sm:inline">
                                        {" "}
                                        {error}
                                    </span>
                                    <p className="mt-2 text-sm">
                                        Silakan refresh halaman ini atau hubungi
                                        customer service kami jika masalah
                                        berlanjut.
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                                    <h2 className="text-lg font-medium text-red-800 mb-2">
                                        Error
                                    </h2>
                                    <p className="text-red-700 mb-2">{error}</p>
                                    <button
                                        onClick={retryMidtransLoad}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            )}

                            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium mb-2">
                                    Detail Pembayaran
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Paket
                                        </p>
                                        <p className="font-medium">
                                            {pkg.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Harga
                                        </p>
                                        <p className="font-medium">
                                            {formatRupiah(payment.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Durasi
                                        </p>
                                        <p className="font-medium">
                                            {pkg.duration} bulan
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Status
                                        </p>
                                        <p className="font-medium capitalize">
                                            {payment.status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium text-blue-800 mb-2">
                                    Informasi Pembayaran
                                </h2>
                                <p className="text-blue-700 mb-2">
                                    Silakan klik tombol "Bayar Sekarang" di
                                    bawah untuk melanjutkan ke halaman
                                    pembayaran Midtrans.
                                </p>
                                <p className="text-blue-700">
                                    Anda akan diarahkan ke halaman pembayaran
                                    Midtrans untuk menyelesaikan transaksi.
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handlePayButtonClick}
                                    disabled={isLoading || !snapInitialized}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-green-500 focus:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Memuat...
                                        </>
                                    ) : (
                                        "Bayar Sekarang"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

