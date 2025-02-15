import { useState, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import SearchBar from "./SearchBar";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

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

const Navbar = () => {
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
        <div className="bg-[#153832] p-2 rounded-full mt-2 md:mt-0 flex items-center justify-between px-6 md:px-12 relative">
            <div className="flex items-center gap-2">
                <img
                    src={logofindland}
                    alt="Findland Logo"
                    className="w-12 h-12"
                />
                <div className="md:hidden flex-1">
                    <SearchBar className="w-full" />
                </div>
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
                                className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg"
                                onBlur={handleClickOutside}
                                tabIndex={0}
                            >
                                {nav.dropdown.map((item, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        href={item.href}
                                        className="block px-4 py-2 text-black hover:bg-gray-200 rounded-lg"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div className="hidden md:flex md:ml-auto">
                    <SearchBar className="w-64" />
                </div>
            </nav>
            <button className="hidden md:flex bg-[#0074E8] rounded-full p-2 px-8 items-center justify-center font-bold text-white">
                <Link href="/login">Login/Daftar</Link>
            </button>
        </div>
    );
};

export default Navbar;
