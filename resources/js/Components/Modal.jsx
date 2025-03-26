import { Dialog, Transition } from "@headlessui/react";
import { useRef, useEffect, Fragment} from 'react';

export default function Modal({
    children,
    title,
    show = false,
    onClose = () => {},
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                console.log("Click outside modal detected");
                onClose();
            }
        }

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [show, onClose]);

    return (
        <Transition show={show} leave="duration-0">
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                    </Transition.Child>

                    <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:mx-auto sm:w-3/4 sm:align-middle">
                        <div 
                            ref={modalRef} 
                            className="bg-white flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header - Fixed at top */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                                <h3 className="text-xl font-semibold text-lowokwaru">
                                    {title}
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500 text-3xl font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[calc(90vh-80px)]">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}








