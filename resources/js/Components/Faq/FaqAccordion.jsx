import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FaqAccordion = ({ id, active, toggle, quest, answer }) => {
    const isClicked = active === id;

    const toggleAccordion = () => {
        toggle(isClicked ? null : id);
    };

    return (
        <motion.div
            layout
            initial={false}
            className="border rounded-2xl border-secondary500 w-full h-auto flex-shrink-0 p-5 text-left transition-all duration-300 ease-in-out hover:shadow-md"
        >
            <motion.header
                onClick={toggleAccordion}
                className="flex items-center justify-between cursor-pointer"
            >
                <h1 className="text-lowokwaru font-montserrat font-bold leading-normal text-lg lg:text-xl px-4">
                    {quest}
                </h1>
                <motion.span
                    className={`text-green text-3xl transform transition-transform duration-300  ${
                        isClicked ? "rotate-180" : "rotate-0"
                    }`}
                >
                    {isClicked ? "−" : "+"}
                </motion.span>
            </motion.header>

            <AnimatePresence initial={false}>
                {isClicked && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="scroll-hidden"
                    >
                        <motion.p
                            className="font-montserrat-light text-base leading-normal text-lowokwaru lg:text-lg px-4 scroll-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {answer}
                        </motion.p>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FaqAccordion;
