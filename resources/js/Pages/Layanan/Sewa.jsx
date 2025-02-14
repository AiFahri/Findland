import { Head } from "@inertiajs/react";
import Product from "../Product";
import datatanah from "../../Data/tanah.json";

const Sewa = () => {
    const filteredData = datatanah.filter(
        (item) => item.status === "Disewakan"
    );

    return (
        <div className="p-8">
            <Head title="Sewa Lahan" />
            <h1 className="text-4xl font-extrabold text-[#3E5245] mb-6">
                Tanah untuk Disewakan
            </h1>
            <Product data={filteredData} />
        </div>
    );
};

export default Sewa;
