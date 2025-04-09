import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { formatRupiah } from "@/Utils/formatter";

export default function Checkout({
    payment,
    package: pkg,
    landListing,
    snapToken,
    clientKey,
    error,
}) {
    useEffect(() => {
        console.log("Checkout component mounted");
        console.log("Snap Token:", snapToken);
        console.log("Client Key:", clientKey);

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        script.onload = () => {
            console.log("Snap.js loaded successfully");

            if (snapToken && snapToken !== "development-fallback-token") {
                try {
                    console.log(
                        "Attempting to open Midtrans popup with token:",
                        snapToken
                    );

                    if (window.snap) {
                        window.snap.pay(snapToken, {
                            onSuccess: function (result) {
                                console.log("Payment success:", result);
                                window.location.href = `/payments/finish?order_id=${payment.id}`;
                            },
                            onPending: function (result) {
                                console.log("Payment pending:", result);
                                window.location.href = `/payments/unfinish?order_id=${payment.id}`;
                            },
                            onError: function (result) {
                                console.log("Payment error:", result);
                                window.location.href = `/payments/error?order_id=${payment.id}`;
                            },
                            onClose: function () {
                                console.log(
                                    "Customer closed the payment popup without finishing payment"
                                );
                                window.location.href = `/payments/unfinish?order_id=${payment.id}`;
                            },
                        });
                    } else {
                        console.error(
                            "Snap.js not loaded properly. window.snap is undefined"
                        );
                        alert(
                            "Terjadi kesalahan saat memuat Midtrans. Silakan refresh halaman ini."
                        );
                    }
                } catch (error) {
                    console.error("Error opening Snap payment popup:", error);
                    alert(
                        "Terjadi kesalahan saat membuka popup pembayaran. Silakan refresh halaman ini."
                    );
                }
            } else {
                console.warn(
                    "Invalid or development snap token, not opening payment popup"
                );
            }
        };

        script.onerror = () => {
            console.error("Failed to load Snap.js");
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            console.log("Checkout component unmounting");
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [snapToken, clientKey, payment.id]);

    return (
        <MainLayout>
            <Head title="Checkout Pembayaran" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-4">
                                Memproses Pembayaran
                            </h1>
                            <p className="mb-4">
                                Mohon tunggu, kami sedang memproses pembayaran
                                Anda...
                            </p>

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
                                    <div className="mt-4">
                                        <a
                                            href="/"
                                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Kembali ke Beranda
                                        </a>
                                    </div>
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

                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                            <p className="text-center mt-4 text-sm text-gray-500">
                                Jika popup pembayaran tidak muncul, silakan
                                refresh halaman ini.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
