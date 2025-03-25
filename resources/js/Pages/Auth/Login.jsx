import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import house from "../../../assets/house.jpg";
import google from "../../../assets/google.svg";
import lockIcon from "../../../assets/padlock 1.svg";
import emailIcon from "../../../assets/message 1.svg";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onError: (errors) => {
                if (errors.email) {
                    setErrorMessage("Email atau password salah");
                    reset("password");
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-login-pattern bg-cover bg-center">
            <div className="w-full max-w-[1300px] flex gap-2 p-8">
                <div className="flex-1 hidden lg:block">
                    <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        <img
                            src={house}
                            alt="Modern House"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 max-w-[500px] pl-12">
                    <div className="mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-medium font-sonsie text-pandanwangi mb-8 mt-10">
                            Findland
                        </h2>
                        <h3 className="text-3xl font-extrabold mb-1">
                            Sign In
                        </h3>
                        <div className="text-gray-600">
                            Belum punya akun?{" "}
                            <span>
                                {" "}
                                Anda bisa{" "}
                                <Link
                                    href={route("register")}
                                    className="text-red-500 hover:underline font-extrabold"
                                >
                                    Daftar disini!
                                </Link>
                            </span>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4" autoComplete="on">
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {errorMessage}
                            </div>
                        )}
                        
                        <div>
                            <div className="relative flex items-center">
                                <img
                                    src={emailIcon}
                                    alt="Email"
                                    className="w-5 h-5 absolute left-0"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Masukkan email"
                                    className={`w-full pl-7 pr-10 px-0 py-2 border-0 border-b-2 ${
                                        errors.email || errorMessage ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.email}
                                    onChange={(e) => {
                                        setData("email", e.target.value);
                                        setErrorMessage("");
                                    }}
                                    autoComplete="username email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <img
                                    src={lockIcon}
                                    alt="Lock"
                                    className="w-5 h-5 absolute left-0"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Masukkan Password"
                                    className={`w-full pl-7 pr-10 py-2 border-0 border-b-2 ${
                                        errors.password || errorMessage ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    autoComplete="current-password"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5 text-gray-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5 text-gray-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="rounded border-gray-300 text-pandanwangi shadow-sm focus:ring-pandanwangi"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Ingat saya
                                </span>
                            </label>

                            <Link
                                href={route("password.request")}
                                className="text-sm text-pandanwangi hover:underline"
                            >
                                Lupa password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#17392b] text-white py-3 rounded-3xl font-semibold hover:bg-[#22633a] transition disabled:opacity-75"
                        >
                            Login
                        </button>

                        <div className="text-center text-gray-500">
                            <p>or continue with</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    type="button"
                                    className="p-2 border rounded-full hover:bg-gray-50 transition"
                                >
                                    <img
                                        src={google}
                                        alt="Google"
                                        className="w-6 h-6"
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}










