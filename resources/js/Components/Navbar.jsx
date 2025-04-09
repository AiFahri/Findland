import { FiMenu, FiX } from "react-icons/fi";
import { Link, usePage } from "@inertiajs/react";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import SearchBar from "./SearchBar";
import LogoutIcon from "../../assets/logout.svg";
import ProfileIcon from "../../assets/profile.svg";
import Profile from "@/Pages/Profile/Profile";
import Modal from "@/Components/Modal";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import { useModal } from "@/hooks/useModal";

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

const NavItem = ({ nav, isLayananOpen, layananRef, toggleLayanan }) => {
    const { url } = usePage();

    if (nav.dropdown) {
        return (
            <div className="relative group p-4" ref={layananRef}>
                <button
                    onClick={toggleLayanan}
                    className="flex items-center text-white hover:text-bunulrejo hover:underline hover:underline-offset-2 cursor-pointer"
                >
                    {nav.label}
                    <img
                        src={dropdown}
                        alt="Dropdown"
                        className="w-4 h-4 ml-1"
                    />
                </button>
                <div
                    className={`absolute z-50 left-0 mt-2 w-40 bg-pandanwangi text-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
                        isLayananOpen
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 -translate-y-2 invisible"
                    }`}
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
            </div>
        );
    }

    return (
        <div className="relative group p-4">
            <Link
                href={nav.href}
                className={`text-white hover:text-bunulrejo hover:underline hover:underline-offset-2 ${
                    url === nav.href ? "text-bunulrejo" : ""
                }`}
            >
                {nav.label}
            </Link>
        </div>
    );
};

const UserMenu = ({
    auth,
    showDropdown,
    profileRef,
    toggleDropdown,
    isModalOpen,
    openModal,
    closeModal,
    isMobile = false,
}) => {
    const { buttonRef } = useDropdownMenu();

    if (!auth.user) {
        return (
            <Link href="/login">
                <button
                    className={`${
                        isMobile ? "w-full" : "flex"
                    } bg-[#0074E8] rounded-full p-2 px-8 items-center justify-center font-bold text-white`}
                >
                    Sign In
                </button>
            </Link>
        );
    }

    return (
        <div className={`relative ${isMobile && !showDropdown ? "h-fit" : ""}`}>
            <div className={`${isMobile ? "w-full" : ""}`}>
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className={`flex items-center gap-3 ${
                        isMobile ? "w-full" : ""
                    } border border-gray-200 rounded-lg px-3 py-1.5 hover:text-lowokwaru`}
                >
                    <span className="text-white">
                        {auth.user.first_name} {auth.user.last_name}
                    </span>
                    <div className="w-8 h-8 rounded-full overflow-hidden ml-auto">
                        <img
                            src={
                                auth.user.profile_picture_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    auth.user.first_name +
                                        " " +
                                        auth.user.last_name
                                )}&background=fff&color=153832`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </button>
            </div>
            <div
                ref={profileRef}
                className={`${
                    isMobile
                        ? "w-full mt-2"
                        : "absolute right-0 top-full mt-2 min-w-full"
                } bg-white rounded-lg shadow-lg border border-gray-100 py-1 transform transition-all duration-300 ease-in-out ${
                    showDropdown
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible h-0 overflow-hidden"
                }`}
            >
                <button
                    onClick={openModal}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                    <img src={ProfileIcon} alt="Profile" className="w-5 h-5" />
                    <span>Edit Profile</span>
                </button>
                <Link
                    href={route("payments.index")}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                    </svg>
                    <span>Riwayat Pembayaran</span>
                </Link>
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                    <img src={LogoutIcon} alt="Logout" className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

const Navbar = ({ auth }) => {
    const { isOpen: isMenuOpen, toggle: toggleMenu } = useDropdownMenu();
    const {
        isOpen: isLayananOpen,
        dropdownRef: layananRef,
        toggle: toggleLayanan,
    } = useDropdownMenu();
    const {
        isOpen: showDropdown,
        dropdownRef: profileRef,
        toggle: toggleDropdown,
    } = useDropdownMenu();
    const {
        isOpen: isModalOpen,
        open: openModal,
        close: closeModal,
    } = useModal();

    return (
        <>
            <div className="bg-[#153832] p-2 rounded-full mt-2 lg:mt-0 flex items-center justify-between px-4 sm:px-6 lg:px-12 relative z-50">
                <div className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src={logofindland}
                            alt="Findland Logo"
                            className="w-full h-full"
                        />
                    </Link>
                </div>

                <div className="flex-1 min-w-0 px-2 [@media(min-width:1024px)]:hidden">
                    <SearchBar />
                </div>

                <button
                    className="w-10 h-10 flex-shrink-0 [@media(min-width:1024px)]:hidden text-white flex items-center justify-center"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                <div className="hidden [@media(min-width:1024px)]:flex [@media(min-width:1024px)]:items-center [@media(min-width:1024px)]:gap-6 [@media(min-width:1024px)]:flex-1">
                    <nav className="flex items-center gap-2">
                        {navLinks.map((nav, index) => (
                            <NavItem
                                key={index}
                                nav={nav}
                                isLayananOpen={isLayananOpen}
                                layananRef={layananRef}
                                toggleLayanan={toggleLayanan}
                            />
                        ))}
                    </nav>
                    <div className="flex-1 mx-4">
                        <SearchBar />
                    </div>
                    <div>
                        <UserMenu
                            auth={auth}
                            showDropdown={showDropdown}
                            profileRef={profileRef}
                            toggleDropdown={toggleDropdown}
                            isModalOpen={isModalOpen}
                            openModal={openModal}
                            closeModal={closeModal}
                        />
                    </div>
                </div>

                <div
                    className={`absolute top-full left-0 right-0 mt-2 bg-[#153832] rounded-lg shadow-lg [@media(min-width:1024px)]:hidden transform transition-all duration-300 ease-in-out ${
                        isMenuOpen
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 -translate-y-4 invisible"
                    }`}
                >
                    <nav className="py-2">
                        {navLinks.map((nav, index) => (
                            <NavItem
                                key={index}
                                nav={nav}
                                isLayananOpen={isLayananOpen}
                                layananRef={layananRef}
                                toggleLayanan={toggleLayanan}
                            />
                        ))}
                        <div className="p-4 border-t border-gray-700">
                            <UserMenu
                                auth={auth}
                                showDropdown={showDropdown}
                                profileRef={profileRef}
                                toggleDropdown={toggleDropdown}
                                isModalOpen={isModalOpen}
                                openModal={openModal}
                                closeModal={closeModal}
                                isMobile={true}
                            />
                        </div>
                    </nav>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} title="Edit Profile">
                <Profile auth={auth} onClose={closeModal} />
            </Modal>
        </>
    );
};

export default Navbar;
