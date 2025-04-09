import { Head, Link, useForm } from "@inertiajs/react";
import logofindland from "../../../../public/assets/findland.svg";
import { FiMail } from "react-icons/fi";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Verifikasi Email" />

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img
                        src={logofindland}
                        alt="FindLand Logo"
                        className="h-16 w-auto"
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FiMail className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
                        Verifikasi Email Anda
                    </h2>

                    <div className="mb-6 text-center text-gray-600">
                        Terima kasih telah mendaftar! Sebelum memulai, silakan
                        verifikasi alamat email Anda dengan mengklik tautan yang
                        baru saja kami kirimkan ke email Anda. Jika Anda tidak
                        menerima email, kami akan dengan senang hati mengirimkan
                        email verifikasi lagi.
                    </div>

                    {status === "verification-link-sent" && (
                        <div className="mb-6 text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
                            Tautan verifikasi baru telah dikirim ke alamat email
                            yang Anda berikan saat pendaftaran.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                                    processing
                                        ? "bg-blue-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } transition duration-150 ease-in-out`}
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Kirim Ulang Email Verifikasi"}
                            </button>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full py-3 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                Keluar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
