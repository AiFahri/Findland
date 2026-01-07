import logoyt from "../../assets/yt.svg";
import logoig from "../../assets/ig.svg";
import logophone from "../../assets/phone.svg";
import logoemail from "../../assets/gmail.svg";
import logofindland from "../../../public/assets/findland.svg";
import dropdown from "../../assets/dropdown.svg";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";

const socialLinks = [
    { href: "https://wa.me/62123456789", img: logophone, alt: "Phone" },
    {
        href: "mailto:findland.official@gmail.com",
        img: logoemail,
        alt: "Email",
    },
    {
        href: "https://www.youtube.com/channel/findland",
        img: logoyt,
        alt: "YouTube",
    },
    {
        href: "https://www.instagram.com/findland",
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
                        className="w-4 h-4 ml-1 rotate-180"
                    />
                </button>
                <div
                    className={`absolute z-50 left-0 bottom-full mb-2 w-40 bg-pandanwangi text-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
                        isLayananOpen
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 translate-y-2 invisible"
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

const Footer = () => {
    const { url } = usePage();
    const { isOpen: isMenuOpen, toggle: toggleMenu } = useDropdownMenu();
    const {
        isOpen: isLayananOpen,
        dropdownRef: layananRef,
        toggle: toggleLayanan,
    } = useDropdownMenu();

    return (
        <footer className="bg-[#0E372E] text-bunulrejo p-4 sm:p-6 md:p-12 rounded-3xl">
            <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
                <div className="text-center md:text-left space-y-3 md:space-y-4 w-full md:w-3/5">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium leading-tight">
                        Jual beli tanah
                        <span className="block">terpercaya</span>
                        <span className="block">findland</span>
                    </h2>
                    <p className="font-light text-sm sm:text-lg md:text-lg lg:text-xl leading-relaxed px-2 sm:px-8 md:px-0 max-w-3xl mx-auto md:mx-0">
                        Dibuat untuk kenyamanan Anda demi
                        <span className="block">
                            masa depan properti yang lebih indah dan
                            berkelanjutan
                        </span>
                    </p>
                </div>

                <div className="bg-[#184D42] p-4 sm:p-6 md:p-6 lg:p-8 rounded-2xl mt-6 md:mt-0 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
                    {socialLinks.map((link, index) => (
                        <SocialLink key={index} {...link} />
                    ))}
                </div>
            </div>

            <div className="bg-white/[0.03] p-2 rounded-full mt-2 lg:mt-0 flex items-center justify-between px-3 sm:px-6 md:px-8 lg:px-12 relative z-50">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src={logofindland}
                            alt="Findland Logo"
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                        />
                        <span className="font-light font-sonsie text-sm sm:text-base lg:text-md text-white">
                            Findland Official
                        </span>
                    </Link>
                </div>
                <button
                    className="[@media(min-width:1024px)]:hidden text-white"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <nav
                    className={`absolute bottom-full left-0 right-0 mb-2 bg-white/[0.03] [@media(min-width:1024px)]:static [@media(min-width:1024px)]:flex [@media(min-width:1024px)]:gap-4 lg:gap-6 rounded-full shadow-lg [@media(min-width:1024px)]:shadow-none [@media(min-width:1024px)]:bg-transparent transform transition-all duration-300 ease-in-out ${
                        isMenuOpen
                            ? "opacity-100 -translate-y-2 visible"
                            : "opacity-0 translate-y-2 invisible"
                    } [@media(min-width:1024px)]:opacity-100 [@media(min-width:1024px)]:visible [@media(min-width:1024px)]:translate-y-0`}
                >
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
            </div>
        </footer>
    );
};

export default Footer;
