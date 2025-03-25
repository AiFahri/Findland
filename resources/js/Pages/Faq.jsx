import FaqSection from "@/Components/Faq/FaqSection";
import MainLayout from "@/Layouts/MainLayout";

const Faq = () => {
    return (
        <div className="min-h-screen  px-6 md:px-12">
            <FaqSection />
        </div>
    );
};
Faq.layout = (page) => <MainLayout children={page} />;
export default Faq;
