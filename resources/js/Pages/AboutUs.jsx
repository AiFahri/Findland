import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Card from "../Components/Card";
import datatanah from "../Data/tanah.json";
import { Link } from "@inertiajs/react";

const AboutUs = () => {
    return (
        <div className="px-12 py-8">
            <Navbar />
            <img
                src="/assets/landingpage.jpg"
                className="w-full h-full object-cover mt-4"
            />

            <h1 className="mt-12 text-4xl font-extrabold text-[#3E5245]">
                Properti Terbaru
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-12">
                {datatanah.map((item) => (
                    <Card
                        key={item.id}
                        image={item.image}
                        status={item.status}
                        price={item.price}
                        place={item.place}
                        description={item.description}
                    />
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-6 bg-white rounded-3xl mt-10 md:mt-8 mb-6">
                <div className="bg-lowokwaru text-bunulrejo rounded-3xl flex-1 flex flex-col justify-between p-8 min-h-full md:h-auto">
                    <div className="text-left space-y-4">
                        <h1 className="text-4xl font-medium leading-relaxed">
                            Jual tanah dengan mudah <br />
                            <span>dan cepat hanya di</span> <br />
                            <span className="font-bold">findland</span>
                        </h1>
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium self-end">
                        <Link href="/layanan/jual">Jual Sekarang</Link>
                    </button>
                </div>

                {/* Gambar */}
                <div className="w-full md:w-1/2 flex-1 min-h-full md:h-auto">
                    <img
                        src="/assets/landingpage2.jpg"
                        alt="Landing Page"
                        className="w-full h-full object-cover rounded-3xl"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
