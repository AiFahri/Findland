import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import SearchBar from "./SearchBar";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import LogoutIcon from "../../assets/logout.svg";
import ProfileIcon from "../../assets/profile.svg";
import Profile from "@/Pages/Profile/Profile";
import Modal from "@/Components/Modal";

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

const Navbar = ({ auth }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        window.location.href = "/logout";
    };

    const { url } = usePage();
    const [isLayananOpen, setIsLayananOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        console.log("Opening modal...");
        setModalOpen(true); // Membuka modal
    };

    const closeModal = () => {
        if (!form.processing) {
            // Hanya tutup modal jika form tidak sedang diproses
            console.log("Closing modal...");
            setModalOpen(false);
        } else {
            console.log("Form is processing, modal will stay open.");
        }
    };

    useEffect(() => {
        console.log("Modal state changed: ", isModalOpen);
    }, [isModalOpen]); // Memantau perubahan state modal

    return (
        <div className="bg-[#153832] p-2 rounded-full mt-2 md:mt-0 flex items-center justify-between px-6 md:px-12 relative z-50">
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
                <div className="hidden md:flex md:ml-auto">
                    <SearchBar className="w-64" />
                </div>
            </nav>

            {auth.user ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-1.5  hover:text-lowokwaru"
                    >
                        <span className="text-white">
                            {auth.user.first_name} {auth.user.last_name}
                        </span>
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                                src={
                                    auth.user.profile_picture ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        auth.user.first_name +
                                            " " +
                                            auth.user.last_name
                                    )}`
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </button>
                    {showDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border 
                         border-gray-100 py-1"
                        >
                            <button
                                onClick={openModal}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <img
                                    src={ProfileIcon}
                                    alt="Logout"
                                    className="w-5 h-5"
                                />
                                <span>Edit Profile</span>
                            </button>
                            <Modal
                                show={isModalOpen}
                                onClose={closeModal}
                                title={"Edit Profile"}
                            >
                                <Profile auth={auth} onClose={closeModal} />
                            </Modal>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <img
                                    src={LogoutIcon}
                                    alt="Logout"
                                    className="w-5 h-5"
                                />
                                <span>Logout</span>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/login">
                    <button className="hidden md:flex bg-[#0074E8] rounded-full p-2 px-8 items-center justify-center font-bold text-white">
                        Sign In
                    </button>
                </Link>
            )}
        </div>
    );
};

export default Navbar;
