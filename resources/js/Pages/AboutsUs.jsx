import { Link } from "@inertiajs/react";
import landingpage from "../../../public/assets/about-banner.webp";
import MainLayout from "@/Layouts/MainLayout";
import Service from "../Components/AboutUs/Service";
import Review from "../Components/AboutUs/Review";
import Button from "@/Components/common/Button";

const AboutUs = ({ reviews, canReview, reviewMessage }) => {
    return (
        <>
            <section className="relative mt-4">
                <div className="bg-white border rounded-3xl p-10 md:p-12 max-w-8xl mx-auto relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 ">
                            <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold italic text-pandanwangi">
                                <span className="font-sonsie font-bold">
                                    Findland
                                </span>
                                <br />
                                <span className="text-sm lg:text-2xl">
                                    Mempersembahkan
                                </span>
                            </h2>
                            <p className="text-gray-600 lg:text-xl">
                                Find Land, sebuah website inovatif yang
                                dirancang untuk mempermudah Anda dalam mencari,
                                membeli, dan menjual tanah dengan proses yang
                                cepat, aman, dan transparan.
                            </p>
                            <div className="mt-6 pt-6">
                                <div className="bg-white p-6 shadow-lg rounded-3xl max-w-lg">
                                    <h3 className="text-lg font-semibold text-lowokwaru">
                                        Introduction
                                    </h3>
                                    <p className="text-3xl lg:text-3xl font-bold text-lowokwaru mt-2 leading-tight">
                                        <span className="block">
                                            Visi untuk hunian strategis,
                                        </span>
                                        <span className="block">
                                            berkelanjutan, & terjangkau
                                        </span>
                                    </p>
                                    <Link href="/layanan/beli">
                                        <Button
                                            variant="primary"
                                            className="mt-4 lg:text-xl"
                                        >
                                            Mulai Jelajahi
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <h1 className="text-3xl md:text-5xl font-bold text-pandanwangi text-right">
                                We provide the <br />
                                land for future Property.
                            </h1>
                            <div className="mt-6 ml-auto w-full lg:w-3/4">
                                <img
                                    src={landingpage}
                                    alt="Future Property"
                                    className="rounded-3xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Review
                reviews={reviews}
                canReview={canReview}
                reviewMessage={reviewMessage}
            />
            <Service />
        </>
    );
};

AboutUs.layout = (page) => <MainLayout children={page} />;
export default AboutUs;
