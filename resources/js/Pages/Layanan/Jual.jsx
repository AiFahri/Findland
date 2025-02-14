import { Head } from "@inertiajs/react";
import Footer from "../../Components/Footer";

const Jual = () => {
    return (
        <div className="p-8">
            <Head title="Jual Lahan" />
            <h1 className="text-4xl font-extrabold text-[#3E5245] mb-6">
                Jual Properti Anda
            </h1>
            <p className="text-lg text-gray-700 mb-6">
                Ingin menjual properti Anda? Hubungi kami untuk mendapatkan
                layanan terbaik dalam pemasaran properti.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                Hubungi Kami
            </button>
            <Footer />
        </div>
    );
};

export default Jual;
