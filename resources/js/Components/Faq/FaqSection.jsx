import React, { useState, useEffect, useRef } from "react";
import FaqAccordion from "@/Components/Faq/FaqAccordion";
import faq from "../../Data/faq.json";

const FaqSection = () => {
    const [state, setState] = useState({
        quest: null,
        dataQuest: faq,
        selectedCategory: null,
    });

    const faqHeaderRef = useRef(null);
    const faqAccordionRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState("auto");

    useEffect(() => {
        if (faqHeaderRef.current && faqAccordionRef.current) {
            const headerHeight = faqHeaderRef.current.offsetHeight;
            setHeaderHeight(`${headerHeight}px`);
        }
    }, []);

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
        <section className="h-auto mt-32 md:h-screen relative flex flex-col md:flex-row items-center justify-between md:my-2">
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-x-12 lg:gap-x-36 w-full h-5/6 lg:px-32 container">
                <h1 className="block md:hidden px-2 text-4xl font-bold mb-4 font-montserrat text-secondary500">
                    Frequently Ask Questions
                </h1>
                <div
                    ref={faqHeaderRef}
                    className="w-full lg:w-1/2 md:h-[85%] hidden md:block"
                >
                    aa
                </div>
                <div
                    ref={faqAccordionRef}
                    className="w-full h-full lg:w-1/2 flex flex-col space-y-4 md:overflow-auto md:h-[800px] snap-y snap-mandatory no-scrollbar"
                    style={{ height: headerHeight }}
                >
                    {filteredFaqs.map((e) => (
                        <FaqAccordion
                            key={e.id}
                            id={e.id}
                            active={state.quest}
                            toggle={() => toggleAccordion(e.id)}
                            quest={e.quest}
                            answer={e.answer}
                            className="snap-start"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
