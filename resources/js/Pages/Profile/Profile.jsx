import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Profile({ auth, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    const form = useForm({
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
        email: auth.user.email || "",
        address: auth.user.address || "",
        password: "",
        password_confirmation: "",
        profile_picture: null,
    });

    const validateForm = () => {
        const newErrors = {};

        if (!form.data.first_name)
            newErrors.first_name = "Nama depan wajib diisi";
        if (!form.data.email) newErrors.email = "Email wajib diisi";
        if (form.data.password && form.data.password.length < 8) {
            newErrors.password = "Password minimal 8 karakter";
        }
        if (
            form.data.password &&
            form.data.password !== form.data.password_confirmation
        ) {
            newErrors.password_confirmation =
                "Konfirmasi password tidak sesuai";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateForm()) return;

        console.log("Form submitted, posting data...");

        form.post("/profile", {
            forceFormData: true,
            onSuccess: () => {
                console.log("Data successfully posted");
                form.reset("password", "password_confirmation");
                setPreviewImage(null);
                onClose?.();
                // Reload halaman untuk memperbarui data
                window.location.reload();
            },
        });
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData("profile_picture", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className="w-full bg-white"
            onClick={handleContentClick}
            data-testid="profile-container"
        >
            <div className="p-4 sm:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/3">
                        <img
                            src={
                                previewImage ||
                                auth.user.profile_picture_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    auth.user.first_name +
                                        " " +
                                        auth.user.last_name
                                )}&background=153832&color=fff`
                            }
                            alt="Profile"
                            className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl object-cover"
                        />

                        <div className="mt-4 w-full flex flex-col items-center">
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-600"
                                onChange={handleFileChange}
                            />
                            {/* Catatan: Kita tidak menggunakan form terpisah untuk upload foto, 
                                tapi menyertakannya dalam form utama */}
                            {previewImage && (
                                <div className="mt-2 text-sm text-green-600">
                                    Foto akan disimpan saat Anda klik "Simpan
                                    Perubahan"
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={submit} className="flex-1 space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-lowokwaru text-center md:text-left">
                            Profil Anda
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Nama Depan
                                </label>
                                <input
                                    type="text"
                                    className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                                        errors.first_name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    value={form.data.first_name}
                                    onChange={(e) =>
                                        form.setData(
                                            "first_name",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Nama Belakang
                                </label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                                    value={form.data.last_name}
                                    onChange={(e) =>
                                        form.setData(
                                            "last_name",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Alamat
                                </label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                                    value={form.data.address}
                                    onChange={(e) =>
                                        form.setData("address", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Password Baru (opsional)
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-semibold text-pandanwangi">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 ${
                                            errors.password_confirmation
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Konfirmasi password baru"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff size={20} />
                                        ) : (
                                            <FiEye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className={`px-6 py-3 rounded-lg transition ${
                                    form.processing
                                        ? "bg-gray-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                            >
                                {form.processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
