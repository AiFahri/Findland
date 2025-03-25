import logoyt from "../../assets/yt.svg";
import logoig from "../../assets/ig.svg";
import logophone from "../../assets/phone.svg";
import logoemail from "../../assets/gmail.svg";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import { useState, useRef } from "react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { FiMenu, FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";

const socialLinks = [
    { href: "tel:+62123456789", img: logophone, alt: "Phone" },
    { href: "mailto:findland@email.com", img: logoemail, alt: "Email" },
    {
        href: "https://www.youtube.com/channel/yourchannel",
        img: logoyt,
        alt: "YouTube",
    },
    {
        href: "https://www.instagram.com/fahrinuril_",
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
        <footer className="bg-[#0E372E] text-bunulrejo p-6 md:p-12 rounded-3xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left space-y-4">
                    <h1 className="text-4xl md:text-5xl font-medium leading-tight">
                        Jual beli tanah <br />
                        <span>terpercaya</span> <br />
                        <span>findland</span>
                    </h1>
                    <p className="text-md md:text-xl leading-relaxed">
                        Dibuat untuk kenyamanan Anda <br />
                        demi masa depan properti yang lebih <br />
                        indah dan berkelanjutan
                    </p>
                </div>

                <div className="bg-[#184D42] p-6 rounded-2xl mt-6 md:mt-0 grid grid-cols-2 gap-4">
                    {socialLinks.map((link, index) => (
                        <SocialLink key={index} {...link} />
                    ))}
                </div>
            </div>

            <div className="bg-[#153832] p-2  rounded-full mt-2 md:mt-0 flex items-center justify-between px-6 md:px-12 relative z-50">
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
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <nav
                    className={`absolute md:static top-16 left-0 w-full md:w-auto bg-[#153832] md:flex md:gap-6 mt-0 md:mt-0 rounded-lg shadow-lg md:shadow-none transition-all ${
                        isMenuOpen ? "block" : "hidden"
                    }`}
                >
                    {navLinks.map((nav, index) => (
                        <div
                            key={index}
                            className="relative group p-4 md:p-4"
                            ref={dropdownRef}
                        >
                            {nav.dropdown ? (
                                <button
                                    onClick={handleToggle}
                                    className="flex items-center text-white hover:text-bunulrejo hover:underline hover:underline-offset-2 cursor-pointer"
                                >
                                    {nav.label}{" "}
                                    <img
                                        src={dropdown}
                                        alt="Dropdown"
                                        className="w-4 h-4 ml-1"
                                    />
                                </button>
                            ) : (
                                <Link
                                    href={nav.href}
                                    className={`text-white hover:text-bunulrejo hover:underline hover:underline-offset-2 ${
                                        url === nav.href
                                            ? "text-bunulrejo"
                                            : "text-bunulrejo"
                                    }`}
                                >
                                    {nav.label}
                                </Link>
                            )}
                            {nav.dropdown && isLayananOpen && (
                                <div
                                    className="absolute z-50 left-0 mt-2 w-40 bg-pandanwangi text-white rounded-lg shadow-lg"
                                    onBlur={handleClickOutside}
                                    tabIndex={0}
                                >
                                    {nav.dropdown.map((item, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            href={item.href}
                                            className="block px-4 py-2 text-white hover:bg-lowokwaru rounded-lg"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
