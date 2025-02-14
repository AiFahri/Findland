import FaqSection from "@/Components/Faq/FaqSection";
import Navbar from "@/Components/Navbar";
const Faq = () => {
    return (
        <>
            <div>
                <Navbar />
                <div className="text-md font-extrabold text-bunulrejo border w-16 px-2 py-0  bg-[#7FB290] rounded-md">
                    FAQ's
                </div>
                <h2 className="text-4xl font-extrabold text-[#8EB69B]">
                    we're here to answer all your questions.
                </h2>
                <p className="text-sm font-light text-lowokwaru">
                    Jika anda memiliki pertanyaan di benak anda, semoga halaman
                    ini bisa menjawabnya
                </p>
            </div>
            <FaqSection />
        </>
    );
};

export default Faq;
