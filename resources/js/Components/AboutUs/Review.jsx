import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import doubleQuote from "../../../assets/doubleQuote.svg";
import starFilled from "../../../assets/starFilled.svg";
import starEmpty from "../../../assets/starEmpty.svg";
import Modal from "@/Components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useReviewForm } from "@/hooks/useReviewForm";

const Review = ({ reviews }) => {
    const { isAuthenticated } = useAuth();
    const {
        form,
        rating,
        setRating,
        charCount,
        showConfirmModal,
        setShowConfirmModal,
        isSubmitting,
        successMessage,
        errorMessage,
        handleContentChange,
        handleSubmit,
        maxChars,
    } = useReviewForm();

    const submitReview = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    return (
        <>
            <Modal
                show={showConfirmModal}
                onClose={() => !isSubmitting && setShowConfirmModal(false)}
                title="Konfirmasi Pengiriman"
            >
                <div className="p-6 max-w-sm mx-auto text-center ">
                    <p className="text-gray-600 mb-6">
                        Apakah Anda yakin ingin mengirim ulasan ini?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="mt-8 bg-[#f7f8f8] border rounded-3xl p-10 md:p-12 max-w-8xl mx-auto relative">
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {errorMessage}
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-lowokwaru">
                            Apa kata <br /> Customer Kami
                        </h2>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg lg:text-3xl font-semibold text-pandanwangi flex items-center gap-2">
                            <span className="text-2xl">
                                <img
                                    src={doubleQuote}
                                    className="w-5"
                                    alt="doubleQuote"
                                />
                            </span>{" "}
                            Masukkan Ulasan Anda
                        </h3>
                        <div className="relative">
                            <textarea
                                className="w-full mt-4 p-4 pb-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 break-words whitespace-pre-wrap"
                                placeholder="Tulis ulasan Anda di sini (10-200 karakter)..."
                                rows="3"
                                value={form.data.content}
                                onChange={handleContentChange}
                                minLength={10}
                                maxLength={maxChars}
                                style={{
                                    overflowWrap: "break-word",
                                    wordWrap: "break-word",
                                }}
                            ></textarea>
                            <div className="absolute bottom-4 right-4 flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <img
                                        key={i}
                                        src={
                                            rating >= i ? starFilled : starEmpty
                                        }
                                        alt={`Star ${i}`}
                                        className="w-5 h-5 cursor-pointer transition-transform hover:scale-110"
                                        onClick={() => {
                                            setRating(i);
                                            form.setData("rating", i);
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="absolute bottom-4 left-4 text-sm text-gray-500">
                                {charCount}/{maxChars}
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={submitReview}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="mt-8"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 min-h-[200px] flex flex-col justify-between">
                                <p
                                    className="text-gray-600 text-sm mb-4 break-words whitespace-pre-wrap"
                                    style={{
                                        overflowWrap: "break-word",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    {review.content}
                                </p>
                                <div className="flex justify-end items-center gap-3">
                                    <img
                                        src={
                                            review.user.profile_picture ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                review.user.first_name +
                                                    " " +
                                                    review.user.last_name
                                            )}&background=153832&color=fff`
                                        }
                                        alt={review.user.first_name}
                                        className="w-10 h-10 rounded-full border border-gray-300"
                                    />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {review.user.first_name}{" "}
                                            {review.user.last_name}
                                        </h4>
                                        <div className="flex justify-end gap-1">
                                            {[...Array(review.rating)].map(
                                                (_, i) => (
                                                    <img
                                                        key={i}
                                                        src={starFilled}
                                                        alt="star"
                                                        className="w-2 h-2"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
};
export default Review;
