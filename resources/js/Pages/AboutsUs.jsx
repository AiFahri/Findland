import { Link } from "@inertiajs/react";
import landingpage from "../../../public/assets/landingpage3.jpg";
import MainLayout from "@/Layouts/MainLayout";
import Service from "../Components/AboutUs/Service";
import Review from "../Components/AboutUs/Review";

const AboutUs = ({ reviews }) => {
    return (
        <>
            <section className="relative mt-4">
                <div className="bg-white border  rounded-3xl p-10 md:p-12 max-w-7xl mx-auto relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 mr-36">
                            <h2 className="text-xl md:text-2xl font-semibold italic text-pandanwangi">
                                <span className="font-sonsie font-bold">
                                    Findland
                                </span>
                                <br />
                                <span className="text-sm">Mempersembahkan</span>
                            </h2>
                            <p className="text-gray-600">
                                Find Land, sebuah website inovatif yang
                                dirancang untuk mempermudah Anda dalam mencari,
                                membeli, dan menjual tanah dengan proses yang
                                cepat, aman, dan transparan.
                            </p>
                            <div className="border-t border-gray-300 mt-6 pt-6">
                                <div className="bg-white p-6 shadow-lg rounded-3xl">
                                    <h3 className="text-lg font-semibold text-lowokwaru">
                                        Introduction
                                    </h3>
                                    <p className="text-3xl font-bold text-lowokwaru mt-2">
                                        Visi untuk hunian strategis,
                                        berkelanjutan, & terjangkau
                                    </p>
                                    <button className="mt-4 px-6 py-3 bg-lowokwaru text-white rounded-lg hover:bg-green-800 transition">
                                        <Link href="/layanan/beli">
                                            Mulai Jelajahi
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="relative -ml-36">
                            <h1 className="text-3xl md:text-5xl font-bold text-pandanwangi">
                                We provide the <br />
                                land for future Property.
                            </h1>
                            <div className="mt-6">
                                <img
                                    src={landingpage}
                                    alt="Future Property"
                                    className="rounded-3xl shadow-lg w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Review reviews={reviews} />
            <Service />
        </>
    );
};

AboutUs.layout = (page) => <MainLayout children={page} />;
export default AboutUs;
