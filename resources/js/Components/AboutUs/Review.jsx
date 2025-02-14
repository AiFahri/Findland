import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

const Review = ({ reviews }) => {
    const { auth } = usePage().props; // Untuk mendapatkan user login
    const [rating, setRating] = useState(5);
    const form = useForm({
        content: "",
        rating: 5,
    });

    const submitReview = (e) => {
        e.preventDefault();
        form.post("/reviews", {
            onSuccess: () => {
                form.reset();
                setRating(5); // Reset rating setelah kirim
            },
        });
    };
    return (
        <>
            {/* Section Ulasan */}
            <div className="mt-8 bg-white border  rounded-3xl p-10 md:p-12 max-w-7xl mx-auto relative">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Judul */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-green-900">
                            Apa kata <br /> Customer Kami
                        </h2>
                    </div>

                    {/* Form Ulasan */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                            <span className="text-2xl">“</span> Masukkan Ulasan
                            Anda
                        </h3>
                        <textarea
                            className="w-full mt-4 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Tulis ulasan Anda di sini..."
                            rows="3"
                            value={form.content}
                            onChange={(e) =>
                                form.setData("content", e.target.value)
                            }
                        ></textarea>

                        {/* Rating Bintang */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span
                                        key={i}
                                        className={`text-xl cursor-pointer ${
                                            rating >= i
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                        onClick={() => {
                                            setRating(i);
                                            form.setData("rating", i);
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={submitReview}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slider Review */}
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
                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                <p className="text-gray-600">
                                    {review.content}
                                </p>
                                <div className="flex items-center gap-3 mt-4">
                                    <img
                                        src={
                                            review.user.profile_picture ||
                                            `https://i.pravatar.cc/150?u=${review.user.id}`
                                        }
                                        alt={review.user.first_name}
                                        className="w-10 h-10 rounded-full border border-gray-300"
                                    />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {review.user.first_name}{" "}
                                            {review.user.last_name}
                                        </h4>
                                        <div className="flex gap-1 text-yellow-500 text-sm">
                                            {Array(review.rating)
                                                .fill("★")
                                                .map((star, i) => (
                                                    <span key={i}>{star}</span>
                                                ))}
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
