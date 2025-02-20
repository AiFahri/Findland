import React from "react";
import { Link } from "@inertiajs/react";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-6">
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                </div>
                <nav className="mt-10">
                    <Link
                        href={route("admin.dashboard")}
                        className="block py-2 px-4 hover:bg-gray-700"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href={route("admin.properties.total")}
                        className="block py-2 px-4 hover:bg-gray-700"
                    >
                        Total Listings
                    </Link>
                    <Link
                        href={route("admin.properties.pending")}
                        className="block py-2 px-4 hover:bg-gray-700"
                    >
                        Pending Listings
                    </Link>
                </nav>
            </div>
            <div className="flex-1 p-10">{children}</div>
        </div>
    );
};

export default AdminLayout;
