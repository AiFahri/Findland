import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import house from "../../../assets/house.jpg";
import emailIcon from "../../../assets/message 1.svg";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-login-pattern bg-cover bg-center">
            <div className="w-full max-w-[1300px] flex gap-2 p-8">
                {/* Left side - Image */}
                <div className="flex-1 hidden lg:block">
                    <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        <img
                            src={house}
                            alt="Modern House"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="flex-1 max-w-[500px] pl-12">
                    <div className="mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-medium font-sonsie text-pandanwangi mb-8 mt-10">
                            Findland
                        </h2>
                        <h3 className="text-3xl font-extrabold mb-1">
                            Lupa Password
                        </h3>
                        <p className="text-gray-600">
                            Ingat password Anda?{" "}
                            <Link
                                href={route("login")}
                                className="text-red-500 hover:underline font-extrabold"
                            >
                                Login disini!
                            </Link>
                        </p>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                        Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password Anda.
                    </div>

                    {status && (
                        <div className="mb-4 p-4 rounded-lg bg-bunulrejo text-lowokwaru font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <div className="relative flex items-center">
                                <img
                                    src={emailIcon}
                                    alt="Email"
                                    className="w-5 h-5 absolute left-0"
                                />
                                <input
                                    type="email"
                                    placeholder="Masukkan email"
                                    className={`w-full pl-7 pr-10 py-2 border-0 border-b-2 ${
                                        errors.email ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && (
                                <div className="text-sm text-red-500 mt-1">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#17392b] text-white py-3 rounded-3xl font-semibold hover:bg-[#22633a] transition disabled:opacity-75"
                        >
                            Kirim Link Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

