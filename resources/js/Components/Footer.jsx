import logoyt from "../../assets/yt.svg";
import logoig from "../../assets/ig.svg";
import logophone from "../../assets/phone.svg";
import logoemail from "../../assets/gmail.svg";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import { useState, useRef } from "react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

const socialLinks = [
    { href: "tel:+62123456789", img: logophone, alt: "Phone" },
    { href: "mailto:example@email.com", img: logoemail, alt: "Email" },
    {
        href: "https://www.youtube.com/channel/yourchannel",
        img: logoyt,
        alt: "YouTube",
    },
    {
        href: "https://www.instagram.com/yourinstagram",
        img: logoig,
        alt: "Instagram",
    },
];

const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentangkami", label: "Tentang Kami" },
    {
        href: "/layanan",
        label: "Layanan",
        dropdown: [
            { href: "/layanan/jual", label: "Jual Lahan" },
            { href: "/layanan/beli", label: "Beli Lahan" },
            { href: "/layanan/sewa", label: "Sewa Lahan" },
        ],
    },
    { href: "/faq", label: "FAQ" },
];

const SocialLink = ({ href, img, alt }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-full p-3 flex items-center justify-center"
    >
        <img src={img} alt={alt} className="w-6 h-6" />
    </a>
);

const Footer = () => {
    const { url } = usePage();
    const [isLayananOpen, setIsLayananOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsLayananOpen(false);
        }
    };

    const handleToggle = () => {
        setIsLayananOpen((prev) => !prev);
    };
    return (
        <footer className="bg-[#0E372E] text-bunulrejo p-8 rounded-3xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left space-y-4">
                    <h1 className="text-5xl font-medium leading-tight">
                        Jual beli tanah <br />
                        <span>terpercaya</span> <br />
                        <span>findland</span>
                    </h1>
                    <p className="text-xl leading-relaxed">
                        Dibuat untuk kenyamanan Anda <br />
                        demi masa depan properti yang lebih <br />
                        indah dan berkelanjutan
                    </p>
                </div>

                <div className="bg-[#184D42] p-6 rounded-2xl md:mt-0 grid grid-cols-2 gap-4">
                    {socialLinks.map((link, index) => (
                        <SocialLink key={index} {...link} />
                    ))}
                </div>
            </div>

            <div className="bg-[#184D42] p-3 rounded-full mt-6 md:mt-0 flex flex-wrap justify-center md:justify-between items-center px-12">
                <div className="flex items-center gap-2">
                    <img
                        src={logofindland}
                        alt="Findland Logo"
                        className="w-12 h-12"
                    />
                    <span className="font-light font-sonsie text-md text-white">
                        Findland
                    </span>
                </div>
                <nav className="flex flex-row flex-wrap justify-start items-center gap-4 mt-4 md:mt-0">
                    {navLinks.map((nav, index) => (
                        <div
                            key={index}
                            className="relative group"
                            ref={dropdownRef}
                        >
                            {nav.dropdown ? (
                                <div className="relative">
                                    <button
                                        onClick={handleToggle}
                                        className="flex items-center text-white hover:text-bunulrejo 
                        hover:underline hover:underline-offset-2 cursor-pointer"
                                    >
                                        <span>{nav.label}</span>
                                        <img
                                            src={dropdown}
                                            alt="Dropdown"
                                            className="w-4 h-4 ml-1"
                                        />
                                    </button>
                                    {nav.dropdown && isLayananOpen && (
                                        <div
                                            className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
                                            onBlur={handleClickOutside}
                                            tabIndex={0}
                                        >
                                            {nav.dropdown.map(
                                                (item, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={item.href}
                                                        className="block px-4 py-2 text-black hover:bg-gray-200 rounded-lg"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={nav.href}
                                    className={`text-white hover:text-bunulrejo hover:underline hover:underline-offset-2 ${
                                        url === nav.href
                                            ? "text-bunulrejo"
                                            : "text-white"
                                    }`}
                                >
                                    {nav.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
