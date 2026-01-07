import React from "react";
import { usePage, Head } from "@inertiajs/react";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const MainLayout = ({ children, title, description, keywords, ogImage }) => {
    const { auth } = usePage().props;

    const defaultTitle = "FindLand - Temukan Properti Impian Anda";
    const defaultDescription =
        "Platform pencarian properti terbaik di Indonesia";
    const defaultKeywords = "properti, tanah, rumah, jual beli properti";
    const defaultOgImage = "/images/og-image.jpg";

    return (
        <>
            <Head>
                <title>{title || defaultTitle}</title>
                <meta
                    name="description"
                    content={description || defaultDescription}
                />
                <meta name="keywords" content={keywords || defaultKeywords} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={title || defaultTitle} />
                <meta
                    property="og:description"
                    content={description || defaultDescription}
                />
                <meta property="og:image" content={ogImage || defaultOgImage} />
            </Head>
            <div className="px-8 md:px-12 lg:px-12 py-6 bg-[#f1f1f1]">
                <Navbar auth={auth} />
                {children}
                <Footer />
            </div>
        </>
    );
};

export default MainLayout;
