import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

const Jual = () => {
    const { packageId } = usePage().props ?? {};
    const [selectedPackage, setSelectedPackage] = useState(packageId || null);
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { flash, errors } = usePage().props;

    useEffect(() => {
        if (packageId) {
            setSelectedPackage(packageId);
        }
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
        if (flash?.error) {
            setErrorMessage(flash.error);
        }
    }, [packageId, flash]);

    const [saveInfo, setSaveInfo] = useState(false);
    const form = useForm({
        package_id: selectedPackage || "",
        full_name: "",
        birth_place_date: "",
        address: "",
        ktp_id: "",
        phone_number: "",
        npwp: "",
        ktp_scan: null,
        land_photos: [],
        status: "Dijual", 
        agree_terms: false,
    });

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length + images.length > 4) {
            setErrorMessage("Anda hanya bisa mengupload maksimal 4 gambar!");
            return;
        }
        handleFiles(files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length + images.length > 4) {
            setErrorMessage("Anda hanya bisa mengupload maksimal 4 gambar!");
            return;
        }
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validImages = [...images];
        let error = "";

        for (let file of files) {
            if (!file.type.startsWith("image/")) {
                error = "File harus berupa gambar (JPG, JPEG, PNG)";
                continue;
            }
            if (file.size > 2 * 1024 * 1024) {
                error = "Ukuran gambar maksimal 2MB";
                continue;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                validImages.push({ file, preview: reader.result });
                setImages([...validImages]);
                form.setData(
                    "land_photos",
                    validImages.map((img) => img.file)
                );
            };
            reader.readAsDataURL(file);
        }

        setErrorMessage(error);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        form.setData(
            "land_photos",
            newImages.map((img) => img.file)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        const formData = new FormData();

        Object.keys(form.data).forEach((key) => {
            if (key !== "land_photos" && key !== "ktp_scan") {
                formData.append(key, form.data[key]);
            }
        });

        if (form.data.ktp_scan) {
            formData.append("ktp_scan", form.data.ktp_scan);
        }

        form.data.land_photos.forEach((file, index) => {
            formData.append(`land_photos[${index}]`, file);
        });

        if (selectedPackage) {
            formData.append("package_id", selectedPackage);
        }

        form.post("/jual-lahan", {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setImages([]);
                setSuccessMessage(
                    "Pengajuan lahan berhasil dikirim. Silakan tunggu konfirmasi admin."
                );
            },
            onError: (errors) => {
                console.error("Submission errors:", errors);
                const errorMessages = Object.entries(errors)
                    .map(([key, message]) => `${key}: ${message}`)
                    .join("\n");

                setErrorMessage(
                    `Gagal mengirim pengajuan. Silakan periksa kembali data Anda:\n${errorMessages}`
                );
            },
        });
    };

    return (
        <>
            <div className="max-w-7xl mx-auto bg-white mb-8">
                <div>
                    <Head title="Jual Lahan" />
                    <h1 className="text-4xl font-extrabold text-[#3E5245] mb-6 mt-8">
                        Jual Lahan - Paket{" "}
                        {selectedPackage
                            ? selectedPackage
                            : "Tidak ada paket terpilih"}
                    </h1>
                    {successMessage && (
                        <div
                            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {successMessage}
                            </span>
                        </div>
                    )}

                    {errorMessage && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {errorMessage}
                            </span>
                        </div>
                    )}
                    <p className="text-lg text-gray-700 mb-6">
                        Ingin menjual properti Anda? Silahkan lengkapi data
                        berikut
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-8"
                >
                    <div className="space-y-4">
                        {[
                            {
                                name: "full_name",
                                label: "Nama Lengkap Sesuai KTP",
                            },
                            {
                                name: "birth_place_date",
                                label: "Tempat, Tanggal Lahir",
                            },
                            { name: "address", label: "Alamat" },
                            { name: "ktp_id", label: "ID KTP" },
                            { name: "phone_number", label: "Nomer HP" },
                            { name: "npwp", label: "NPWP" },
                        ].map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label} *
                                </label>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={(e) =>
                                        form.setData(field.name, e.target.value)
                                    }
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                                    placeholder={`Masukkan ${field.label.toLowerCase()}`}
                                />
                                {form.errors[field.name] && (
                                    <p className="text-red-500 text-sm">
                                        {form.errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Scan Foto KTP *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    form.setData("ktp_scan", e.target.files[0])
                                }
                                className="mt-1 w-full text-gray-600 border border-gray-300 p-2 rounded-lg"
                            />
                            {form.errors.ktp_scan && (
                                <p className="text-red-500 text-sm">
                                    {form.errors.ktp_scan}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={saveInfo}
                                onChange={() => setSaveInfo(!saveInfo)}
                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label className="text-sm text-gray-600">
                                Save this information for next time
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status Tanah *
                            </label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Dijual"
                                        checked={form.data.status === "Dijual"}
                                        onChange={() =>
                                            form.setData("status", "Dijual")
                                        }
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Dijual
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Disewa"
                                        checked={form.data.status === "Disewa"}
                                        onChange={() =>
                                            form.setData("status", "Disewa")
                                        }
                                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Disewa
                                    </span>
                                </label>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900">
                            Upload Gambar Tanah (4 Gambar)
                        </h3>
                        {errorMessage && (
                            <p className="text-red-500">{errorMessage}</p>
                        )}
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.preview}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div
                            className="mt-6 border border-dashed border-gray-400 p-10 rounded-lg text-center cursor-pointer bg-gray-100"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <p className="text-gray-600">
                                Drag & drop gambar atau klik untuk memilih
                            </p>
                            <p className="text-gray-500 text-sm">
                                Hanya menerima format JPG, JPEG, PNG (Maks 2MB)
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            className="mt-4 block w-full border border-gray-300 p-2 rounded-lg"
                        />
                        <div className="mt-6">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={form.data.agree_terms}
                                    onChange={(e) =>
                                        form.setData(
                                            "agree_terms",
                                            e.target.checked
                                        )
                                    }
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Dengan ini saya menyatakan bahwa data yang
                                    saya berikan adalah benar dan saya
                                    menyetujui syarat dan ketentuan yang ada.
                                </span>
                            </label>
                            {form.errors.agree_terms && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.errors.agree_terms}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                            disabled={
                                images.length !== 4 ||
                                !form.data.agree_terms ||
                                form.processing
                            }
                        >
                            {form.processing ? "Mengirim..." : "Kirim"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
Jual.layout = (page) => <MainLayout children={page} />;
export default Jual;
