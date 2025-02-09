import logoyt from "../../assets/yt.svg";
import logoig from "../../assets/ig.svg";
import logophone from "../../assets/phone.svg";
import logoemail from "../../assets/gmail.svg";
import logofindland from "../../assets/findland.svg";

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
    { href: "#beranda", label: "Beranda" },
    { href: "#tentang", label: "Tentang Kami" },
    { href: "#layanan", label: "Layanan" },
    { href: "#faq", label: "FAQ" },
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
                <nav className="flex gap-6 mt-4 md:mt-0">
                    {navLinks.map((nav, index) => (
                        <a
                            key={index}
                            href={nav.href}
                            className="text-white hover:text-gray-300"
                        >
                            {nav.label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
