import React, { useState, useEffect, useRef } from "react";
import FaqAccordion from "@/Components/Faq/FaqAccordion";
import faq from "../../Data/faq.json";

const FaqSection = () => {
    const [state, setState] = useState({
        quest: null,
        dataQuest: faq,
        selectedCategory: null,
    });

    const toggleAccordion = (id) => {
        setState((prevState) => ({
            ...prevState,
            quest: prevState.quest === id ? null : id,
        }));
    };

    const filteredFaqs = state.dataQuest.filter(
        (q) =>
            state.selectedCategory === null ||
            q.id_category === state.selectedCategory
    );

    return (
        <section className="w-full flex justify-center items-center mt-4 mb-8">
            <div className="w-full max-w-5xl px-6 lg:px-12 border rounded-3xl bg-white shadow-md p-6">
                <div className="text-center mb-6">
                    <div className="inline-block text-md font-extrabold text-bunulrejo border w-16 px-2 py-0 bg-[#7FB290] rounded-md">
                        <h3>FAQ's</h3>
                    </div>
                    <h2 className="text-5xl font-extrabold text-[#8EB69B] mt-2 mb-3">
                        we're here to answer
                        <h2>all your questions.</h2>
                    </h2>
                    <p className="text-md font-light text-lowokwaru">
                        Jika anda memiliki pertanyaan di benak anda, semoga
                        halaman ini bisa menjawabnya.
                    </p>
                </div>
                <div className="w-full flex flex-col space-y-4">
                    {filteredFaqs.map((e) => (
                        <FaqAccordion
                            key={e.id}
                            id={e.id}
                            active={state.quest}
                            toggle={() => toggleAccordion(e.id)}
                            quest={e.quest}
                            answer={e.answer}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
