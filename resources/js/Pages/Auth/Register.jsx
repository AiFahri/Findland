import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import house from "../../../assets/house.jpg";
import google from "../../../assets/google.svg";
import lockIcon from "../../../assets/padlock 1.svg";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        post(route("register"), {
            onError: (errors) => {
                if (errors.email) {
                    setErrorMessage("Email sudah terdaftar. Silakan gunakan email lain.");
                    reset("password", "password_confirmation");
                }
            },
        });
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
                            Sign Up
                        </h3>
                        <p className="text-gray-600">
                            Jika kamu sudah memiliki akun{" "}
                            <p>
                                Kamu bisa{" "}
                                <Link
                                    href={route("login")}
                                    className="text-red-500 hover:underline font-extrabold"
                                >
                                    Login disini !
                                </Link>
                            </p>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Masukkan nama depan"
                                    className={`w-full px-0 py-2 border-0 border-b-2 ${
                                        errors.first_name ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.first_name}
                                    onChange={(e) => setData("first_name", e.target.value)}
                                />
                                {errors.first_name && (
                                    <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Masukkan nama belakang"
                                    className="w-full px-0 py-2 border-0 border-b-2 border-pandanwangi bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                />
                                {errors.last_name && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.last_name}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="Masukkan email"
                                    className={`w-full px-0 py-2 border-0 border-b-2 ${
                                        errors.email ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && !errorMessage && (
                                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Masukkan alamat"
                                    className="w-full px-0 py-2 border-0 border-b-2 border-pandanwangi bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.address}
                                    </div>
                                )}
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
                                    placeholder="Masukkan Password"
                                    className={`w-full pl-7 pr-10 py-2 border-0 border-b-2 ${
                                        errors.password || errorMessage ? 'border-red-500' : 'border-pandanwangi'
                                    } bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition`}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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
                            {errors.password && !errorMessage && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <img
                                    src={lockIcon}
                                    alt="Lock"
                                    className="w-5 h-5 absolute left-0"
                                />
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Masukkan password lagi"
                                    className="w-full pl-7 pr-10 py-2 border-0 border-b-2 border-pandanwangi bg-transparent focus:border-lowokwaru focus:ring-0 outline-none transition"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
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
                            {errors.password_confirmation && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.password_confirmation}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#17392b] text-white py-3 rounded-3xl font-semibold hover:bg-[#22633a] transition disabled:opacity-75"
                        >
                            Register
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


