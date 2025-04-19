import React from "react";
import { usePage } from "@inertiajs/react";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const MainLayout = ({ children, ...props }) => {
    const { auth } = usePage().props;

    return (
        <div className="px-12 py-6 bg-[#f1f1f1]">
            <Navbar auth={auth} />
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;
