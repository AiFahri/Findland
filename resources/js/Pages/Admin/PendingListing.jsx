import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const PendingListings = ({ pendingListings }) => {
    return (
        <AdminLayout>
            <Head title="Pending Listings" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Pending Listings</h1>

                {pendingListings.data.length === 0 ? (
                    <p>No pending listings found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-md rounded">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">
                                        Full Name
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Status Pembayaran
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Duration
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Submitted At
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {pendingListings.data.map((listing) => (
                                    <tr
                                        key={listing.id}
                                        className="border-b border-gray-200 hover:bg-gray-100"
                                    >
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {listing.full_name}
                                        </td>
                                        <td className="py-3 px-6 text-left">
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
                                            </p>{" "}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {listing.package_id
                                                ? `${
                                                      listing.package_id * 3
                                                  } months`
                                                : "N/A"}{" "}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <p>
                                                {new Date(
                                                    listing.created_at
                                                ).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <Link
                                                href={route(
                                                    "admin.properties.review",
                                                    listing.id
                                                )}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PendingListings;
