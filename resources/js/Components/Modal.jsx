import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

export default function Modal({
    children,
    title,
    show = false,
    onClose = () => {},
}) {
    const close = (event) => {
        console.log("Modal close triggered", event.target);
        if (event.target === event.currentTarget) {
            console.log("Closing modal...");
            onClose(); // Pastikan onClose dipanggil dengan benar
        }
    };

    return (
        <Transition show={show} leave="duration-0">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex transform items-center justify-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close} // Pastikan tidak ada penutupan jika klik di dalam
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="absolute inset-0 bg-gray-500/75"
                        onClick={close}
                    />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel className="mb-6 transform overflow-hidden rounded-3xl bg-white shadow-xl transition-all sm:mx-auto sm:w-3/4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold">{title}</h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Menangguhkan event bubbling
                                    onClose(); // Menutup modal
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times; {/* Close button */}
                            </button>
                        </div>
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
