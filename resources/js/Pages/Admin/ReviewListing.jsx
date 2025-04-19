import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/Modal";
import axios from "axios";
import { generatePropertyImageName } from "@/Utils/imageHelper";

const ReviewListing = ({ listing }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [submittedImages, setSubmittedImages] = useState(
        listing.land_photos || []
    );
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        type: "",
    });

    const { data, setData, post, processing } = useForm({
        status: "",
        admin_notes: "",
        property_details: {
            title: listing.full_name + " - Land Listing",
            description: listing.address,
            price: listing.monthly_income || 0,
            place: listing.address,
            desc_detail: "",
            maps: "",
            wa: listing.phone_number || "",
            land_area: null,
            certificate_type: null,
            featured: false,
            latitude: null,
            longitude: null,
            image: listing.land_photos[0] || null,
            images: listing.land_photos.slice(1) || [],
            status: listing.status || "Dijual",
        },
    });

    const [selectedMainImage, setSelectedMainImage] = useState(
        data.property_details.image
    );

    const selectAsMainImage = (image) => {
        setSelectedMainImage(image);
        setData("property_details", {
            ...data.property_details,
            image: image,
        });
    };

    const removeSubmittedImage = (index) => {
        const newImages = [...submittedImages];
        newImages.splice(index, 1);
        setSubmittedImages(newImages);

        if (index === 0 && newImages.length > 0) {
            // If removing the first image, set the next one as main
            setData("property_details", {
                ...data.property_details,
                image: newImages[0],
                images: newImages.slice(1),
            });
            setSelectedMainImage(newImages[0]);
        } else {
            // Otherwise just update the images array
            setData("property_details", {
                ...data.property_details,
                images: newImages.slice(1),
            });
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split(".").pop().toLowerCase();

        const cleanTitle = data.property_details.title
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase();
        const imageNumber =
            type === "main" ? 1 : data.property_details.images.length + 2;
        const newFileName = generatePropertyImageName(
            listing.id,
            cleanTitle,
            imageNumber,
            extension
        );

        console.log("Uploading image with filename:", newFileName);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("filename", newFileName); // Tambahkan nama file yang diinginkan

        try {
            const response = await axios.post(
                route("admin.properties.upload-image"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const imagePath = response.data.path.replace("/storage/", "");
            console.log("Image uploaded successfully:", imagePath);

            if (type === "main") {
                setData("property_details", {
                    ...data.property_details,
                    image: imagePath,
                });
                setSelectedMainImage(imagePath);
            } else {
                const updatedImages = [
                    ...data.property_details.images,
                    imagePath,
                ];
                setData("property_details", {
                    ...data.property_details,
                    images: updatedImages,
                });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setErrorMessage("Failed to upload image. Please try again.");
        }
    };

    const handleApprove = (actionStatus) => {
        const formData = new FormData();

        formData.append("admin_status", actionStatus);
        formData.append("admin_notes", data.admin_notes || "");

        if (actionStatus === "approved") {
            const propertyDetails = {
                title:
                    data.property_details.title ||
                    `${listing.full_name} - Land Listing`,
                description:
                    data.property_details.description || listing.address,
                price: data.property_details.price || 0,
                place: data.property_details.place || listing.address,
                desc_detail:
                    data.property_details.desc_detail || listing.address,
                maps:
                    data.property_details.maps ||
                    `https://maps.google.com/?q=${listing.address}`,
                wa: data.property_details.wa || listing.phone_number,
                image: data.property_details.image || listing.land_photos[0],
                images:
                    data.property_details.images ||
                    listing.land_photos.slice(1),
                status:
                    data.property_details.status || listing.status || "Dijual", // Gunakan status dari form atau dari land_listing
                featured: data.property_details.featured || false,
                land_area: data.property_details.land_area || null,
                certificate_type:
                    data.property_details.certificate_type || null,
                latitude: data.property_details.latitude || null,
                longitude: data.property_details.longitude || null,
            };

            formData.append(
                "property_details",
                JSON.stringify(propertyDetails)
            );
        }

        console.log("Form Data contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }

        axios
            .post(route("admin.properties.approve", listing.id), formData)
            .then((response) => {
                console.log("Success response:", response);
                setModalContent({
                    title: "Success",
                    message: `Property listing has been successfully ${actionStatus}`,
                    type: "success",
                });
                setShowModal(true);
                setTimeout(() => {
                    window.location.href = route("admin.properties.pending");
                }, 2000);
            })
            .catch((error) => {
                console.error("Error response:", error.response);
                let errorMessage = "";

                if (error.response?.data?.errors) {
                    errorMessage = Object.entries(error.response.data.errors)
                        .map(
                            ([field, messages]) =>
                                `${field}: ${messages.join(", ")}`
                        )
                        .join("\n");
                } else if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = "An unexpected error occurred";
                }

                setModalContent({
                    title: "Error",
                    message: `Failed to ${actionStatus} listing:\n${errorMessage}`,
                    type: "error",
                });
                setShowModal(true);
            });
    };

    return (
        <AdminLayout>
            <Head title={`Review Listing - ${listing.full_name}`} />

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <div
                        className={`text-xl font-bold mb-4 ${
                            modalContent.type === "success"
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {modalContent.title}
                    </div>
                    <div className="text-gray-600">{modalContent.message}</div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Review Property Listing
                </h1>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Seller Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Full Name:</p>
                            <p>{listing.full_name}</p>
                        </div>
                        <div>
                            <p className="font-medium">Birth Place & Date:</p>
                            <p>{listing.birth_place_date}</p>
                        </div>
                        <div>
                            <p className="font-medium">Address:</p>
                            <p>{listing.address}</p>
                        </div>
                        <div>
                            <p className="font-medium">KTP ID:</p>
                            <p>{listing.ktp_id}</p>
                        </div>
                        <div>
                            <p className="font-medium">Phone Number:</p>
                            <p>{listing.phone_number}</p>
                        </div>
                        <div>
                            <p className="font-medium">NPWP:</p>
                            <p>{listing.npwp}</p>
                        </div>
                        <div>
                            <p className="font-medium">Package:</p>
                            <p>{listing.package_id || "No package"}</p>
                        </div>
                        <div>
                            <p className="font-medium">Duration:</p>
                            <p>
                                {listing.package_id
                                    ? `${listing.package_id * 3} months`
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Status Tanah:</p>
                            <p>{listing.status}</p>
                        </div>
                        <div>
                            <p className="font-medium">Status Pembayaran:</p>
                            <p
                                className={
                                    listing.is_paid
                                        ? "text-green-600 font-semibold"
                                        : "text-red-600 font-semibold"
                                }
                            >
                                {listing.is_paid
                                    ? "Sudah Dibayar"
                                    : "Belum Dibayar"}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Submitted At:</p>
                            <p>
                                {new Date(listing.created_at).toLocaleString()}
                            </p>
                        </div>
                        {listing.expiry_date && (
                            <div>
                                <p className="font-medium">Expiry Date:</p>
                                <p>
                                    {new Date(
                                        listing.expiry_date
                                    ).toLocaleString()}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="font-medium">KTP Image</p>
                            <p>
                                <img
                                    src={`/storage/${listing.ktp_scan}`}
                                    alt="KTP Image"
                                    className="w-full h-48 object-cover rounded"
                                />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Submitted Images
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {submittedImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`/storage/${image}`}
                                    alt={`Submitted image ${index + 1}`}
                                    className={`w-full h-48 object-cover rounded cursor-pointer
                                        ${
                                            image === selectedMainImage
                                                ? "ring-4 ring-blue-500"
                                                : ""
                                        }`}
                                    onClick={() => selectAsMainImage(image)}
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {image === selectedMainImage && (
                                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                                            Main Image
                                        </span>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSubmittedImage(index);
                                        }}
                                        className="bg-red-500 text-white rounded-full p-1"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Click on an image to set it as the main image
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg p-6">
                    {isEditing && (
                        <div className="mt-6 border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Edit Property Details
                            </h2>

                            <div className="bg-yellow-50 p-4 mb-6 rounded">
                                <h3 className="font-semibold text-yellow-800 mb-2">
                                    Required Fields
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Main Image*
                                        </label>
                                        <img
                                            src={`/storage/${data.property_details.image}`}
                                            alt="Main property image"
                                            className="mt-2 h-32 object-cover rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Title*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.property_details.title}
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Price (Rp)*
                                        </label>
                                        <input
                                            type="number"
                                            value={data.property_details.price}
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    price: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Place/Area* (Format: "Kecamatan,
                                            Kabupaten")
                                        </label>
                                        <input
                                            type="text"
                                            value={data.property_details.place}
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    place: e.target.value,
                                                })
                                            }
                                            placeholder="Contoh: Lowokwaru, Malang"
                                            className="w-full p-2 border rounded"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: Kecamatan, Kabupaten
                                            (digunakan untuk filter)
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Short Description* (untuk card)
                                        </label>
                                        <textarea
                                            value={
                                                data.property_details
                                                    .description
                                            }
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Deskripsi singkat untuk ditampilkan di card"
                                            className="w-full p-2 border rounded h-24"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maksimal 100 karakter
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Detailed Description* (untuk halaman
                                            detail)
                                        </label>
                                        <textarea
                                            value={
                                                data.property_details
                                                    .desc_detail
                                            }
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    desc_detail: e.target.value,
                                                })
                                            }
                                            placeholder="Deskripsi lengkap properti"
                                            className="w-full p-2 border rounded"
                                            rows="4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Land Area (m²)*
                                        </label>
                                        <input
                                            type="number"
                                            value={
                                                data.property_details
                                                    .land_area || ""
                                            }
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    land_area: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Certificate Type*
                                        </label>
                                        <select
                                            value={
                                                data.property_details
                                                    .certificate_type || ""
                                            }
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    certificate_type:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="">
                                                Select Certificate Type
                                            </option>
                                            <option value="SHM">SHM</option>
                                            <option value="SHGB">SHGB</option>
                                            <option value="AJB">AJB</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            Google Maps Link*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.property_details.maps}
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    maps: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-yellow-800">
                                            WhatsApp Link*
                                        </label>
                                        <input
                                            type="text"
                                            value={data.property_details.wa}
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    wa: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                data.property_details.featured
                                            }
                                            onChange={(e) =>
                                                setData("property_details", {
                                                    ...data.property_details,
                                                    featured: e.target.checked,
                                                })
                                            }
                                            className="mr-2"
                                        />
                                        <label className="text-yellow-800">
                                            Featured Property
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-gray-50 p-4 rounded">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Additional Images
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                handleImageUpload(
                                                    e,
                                                    "additional"
                                                )
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {data.property_details.images.map(
                                                (img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`/storage/${img}`}
                                                        alt={`Additional image ${
                                                            idx + 1
                                                        }`}
                                                        className="h-20 object-cover rounded"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="mt-4">
                                <label className="block mb-2">
                                    Admin Notes
                                </label>
                                <textarea
                                    value={data.admin_notes}
                                    onChange={(e) =>
                                        setData("admin_notes", e.target.value)
                                    }
                                    className="w-full p-2 border rounded h-24"
                                    placeholder="Add any notes about this property listing..."
                                />
                            </div>
                        </div>
                    )}

                    {!listing.is_paid && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-red-700 font-medium">
                                    Peringatan: Listing ini belum dibayar
                                </span>
                            </div>
                            <p className="mt-2 text-red-600 text-sm">
                                Anda tidak dapat menyetujui listing yang belum
                                dibayar. Silakan tunggu hingga pembayaran
                                selesai atau hubungi penjual untuk menyelesaikan
                                pembayaran.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 flex space-x-4">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
                                >
                                    Edit Property Details
                                </button>
                                <button
                                    onClick={() => handleApprove("approved")}
                                    disabled={processing || !listing.is_paid}
                                    className={`${
                                        listing.is_paid
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                    } text-white px-6 py-2 rounded disabled:opacity-50`}
                                    title={
                                        !listing.is_paid
                                            ? "Listing belum dibayar"
                                            : ""
                                    }
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Quick Approve"}
                                </button>
                                <button
                                    onClick={() => handleApprove("rejected")}
                                    disabled={processing}
                                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                    {processing ? "Processing..." : "Reject"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleApprove("approved")}
                                    disabled={processing || !listing.is_paid}
                                    className={`${
                                        listing.is_paid
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                    } text-white px-6 py-2 rounded disabled:opacity-50`}
                                    title={
                                        !listing.is_paid
                                            ? "Listing belum dibayar"
                                            : ""
                                    }
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Save & Approve"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReviewListing;
