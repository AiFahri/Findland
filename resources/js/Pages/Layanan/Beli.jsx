import { Head } from "@inertiajs/react";
import Product from "../Product";
import datatanah from "../../Data/tanah.json";

const Beli = () => {
    const filteredData = datatanah.filter((item) => item.status === "Dijual");

    return (
        <div className="p-8">
            <Head title="Beli Lahan" />
            <h1 className="text-4xl font-extrabold text-[#3E5245] mb-6">
                Tanah untuk Dijual
            </h1>
            <Product data={filteredData} />
        </div>
    );
};

export default Beli;
