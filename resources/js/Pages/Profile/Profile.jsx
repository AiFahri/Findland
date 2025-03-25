import { useForm } from "@inertiajs/react";
import { useState } from "react";
// import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

export default function Profile({ auth, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
        email: auth.user.email || "",
        address: auth.user.address || "",
        password: "",
        password_confirmation: "",
        profile_picture: null,
    });

    const submit = (e) => {
        e.preventDefault();
        console.log("Form submitted, posting data...");

        form.post("/profile", {
            forceFormData: true,
            onSuccess: () => {
                console.log("Data successfully posted");
                form.reset("password", "password_confirmation");
            },
        });
    };

    return (
        <div className="mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl flex gap-12 items-center modal">
            <div className="flex flex-col items-center">
                <img
                    src={
                        auth.user.profile_picture ||
                        "https://i.pravatar.cc/150?u=" + auth.user.id
                    }
                    alt="Profile"
                    className="w-44 h-44 rounded-3xl mr-10"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post("/profile/update-picture", {
                            forceFormData: true,
                        });
                    }}
                >
                    <input
                        type="file"
                        className="mt-2 text-sm text-gray-600 ml-10"
                        onChange={(e) =>
                            form.setData("profile_picture", e.target.files[0])
                        }
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-pandanwangi text-white px-4 py-2 rounded-lg hover:bg-green-700 transition ml-24"
                    >
                        Upload
                    </button>
                </form>
            </div>
            <form onSubmit={submit} className="w-full space-y-6">
                <h2 className="text-4xl font-extrabold text-lowokwaru text-center">
                    Profil Anda
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-pandanwangi">
                            Nama Depan
                        </label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                            value={form.first_name}
                            onChange={(e) =>
                                form.setData("first_name", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-pandanwangi">
                            Nama Belakang
                        </label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                            value={form.last_name}
                            onChange={(e) =>
                                form.setData("last_name", e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-pandanwangi">
                            Email
                        </label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                            value={form.email}
                            onChange={(e) =>
                                form.setData("email", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-pandanwangi">
                            Alamat
                        </label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                            value={form.address}
                            onChange={(e) =>
                                form.setData("address", e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-sm font-semibold text-pandanwangi">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                            value={form.password}
                            onChange={(e) =>
                                form.setData("password", e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Konfirmasi
                    </button>
                </div>
            </form>
        </div>
    );
}
