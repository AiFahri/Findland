import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const ReviewListing = ({ listing }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { post, processing, data, setData } = useForm({
        status: "",
        admin_notes: "",
        property_details: {
            title: listing.full_name + " - Land Listing",
            description: listing.address,
            price: listing.monthly_income,
            location: listing.address,
            land_area: null,
            certificate_type: null,
            featured: false,
            latitude: null,
            longitude: null,
        },
    });

    const handleApprove = (status) => {
        post(route("admin.properties.approve", listing.id), {
            status: status,
            admin_notes: data.admin_notes,
            property_details:
                status === "approved" ? data.property_details : null,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Review Listing - ${listing.full_name}`} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Review Property Listing
                </h1>

                <div className="bg-white shadow-md rounded-lg p-6">
                    {isEditing && (
                        <div className="mt-6 border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Edit Property Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Title</label>
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
                                    <label className="block mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={
                                            data.property_details.description
                                        }
                                        onChange={(e) =>
                                            setData("property_details", {
                                                ...data.property_details,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full p-2 border rounded h-24"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Price</label>
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
                                    <label className="block mb-2">
                                        Land Area (m²)
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            data.property_details.land_area ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setData("property_details", {
                                                ...data.property_details,
                                                land_area: e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : null,
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
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
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">
                                            Feature this property
                                        </span>
                                    </label>
                                </div>
                            </div>
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
                                    disabled={processing}
                                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    Quick Approve
                                </button>
                                <button
                                    onClick={() => handleApprove("rejected")}
                                    disabled={processing}
                                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                >
                                    Reject
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
                                    disabled={processing}
                                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                    Save & Approve
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
