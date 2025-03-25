import { Head, Link } from "@inertiajs/react";

const AdminDashboard = ({ auth, propertyStats, recentListings }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Admin Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/admin/properties/total"
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Total Properties
                        </h2>
                        <p className="text-3xl font-bold text-blue-600">
                            {propertyStats.total_properties}
                        </p>
                    </Link>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Pending Properties
                        </h2>
                        <p className="text-3xl font-bold text-yellow-600">
                            {propertyStats.pending_properties}
                        </p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Active Properties
                        </h2>
                        <p className="text-3xl font-bold text-green-600">
                            {propertyStats.active_properties}
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            Recent Pending Listings
                        </h2>
                        <Link
                            href="/admin/properties/pending"
                            className="text-blue-600 hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    {recentListings.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No pending listings at the moment
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {recentListings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="border-b pb-4 last:border-b-0 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-semibold">
                                            {listing.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            Submitted by: {listing.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                listing.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/properties/${listing.id}/review`}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Review
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
