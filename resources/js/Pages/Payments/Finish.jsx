import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { formatRupiah } from "@/Utils/formatter";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useModal } from "@/hooks/useModal";
import { useEffect } from "react";

export default function Finish({ payment, package: pkg, landListing }) {
    const { isOpen, open, close } = useModal();

    useEffect(() => {
        open();
    }, []);

    return (
        <MainLayout>
            <Head title="Pembayaran Berhasil" />

            <div
                className="fixed inset-0 z-[100] flex items-center justify-center"
                style={{ display: isOpen ? "flex" : "none" }}
            >
                <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={close}
                ></div>
                <div className="bg-white rounded-lg shadow-xl z-[101] w-full max-w-md mx-auto">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Informasi Penting
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 text-3xl font-bold"
                            onClick={close}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-gray-700 text-lg text-center">
                            Tunggu beberapa hari lagi, tanah anda akan kami
                            posting. Jika perlu penyesuaian, Anda akan dihubungi
                            oleh customer service kami. (WhatsApp :{" "}
                            <a
                                href="https://wa.me/6287889601959"
                                className="font-bold underline"
                            >
                                +6287889601959)
                            </a>
                        </p>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={close}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col items-center mb-6">
                                <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                                <h1 className="text-2xl font-semibold">
                                    Pembayaran Berhasil!
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Terima kasih atas pembayaran Anda. Listing
                                    tanah Anda akan segera diproses.
                                </p>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium mb-2">
                                    Detail Pembayaran
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            ID Pembayaran
                                        </p>
                                        <p className="font-medium">
                                            {payment.id}
                                        </p>
                                    </div>
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
                                            Status
                                        </p>
                                        <p className="font-medium capitalize">
                                            {payment.status}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Metode Pembayaran
                                        </p>
                                        <p className="font-medium capitalize">
                                            {payment.payment_type || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Tanggal Pembayaran
                                        </p>
                                        <p className="font-medium">
                                            {payment.paid_at
                                                ? new Date(
                                                      payment.paid_at
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                                <h2 className="text-lg font-medium text-green-800 mb-2">
                                    Langkah Selanjutnya
                                </h2>
                                <p className="text-green-700 mb-2">
                                    Listing tanah Anda akan diproses oleh admin
                                    kami. Anda akan mendapatkan notifikasi
                                    melalui WhatsApp ketika listing Anda telah
                                    disetujui.
                                </p>
                                <p className="text-green-700">
                                    Jika Anda memiliki pertanyaan, silakan
                                    hubungi customer service kami.{" "}
                                    <a
                                        href="https://wa.me/6287889601959"
                                        className="font-bold underline"
                                    >
                                        (Whatsapp : +6287889601959)
                                    </a>
                                </p>
                            </div>

                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route("home")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Kembali ke Beranda
                                </Link>
                                <Link
                                    href={route("payments.index")}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Lihat Riwayat Pembayaran
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
