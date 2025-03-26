import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export const MAX_CHARS = 200;

export const useReviewForm = () => {
    const [rating, setRating] = useState(5);
    const [charCount, setCharCount] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        content: "",
        rating: 5,
    });

    const handleContentChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            form.setData("content", text);
            setCharCount(text.length);
        }
    };

    const resetForm = () => {
        form.reset();
        form.setData({
            content: "",
            rating: 5
        });
        setRating(5);
        setCharCount(0);
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setErrorMessage("");
        
        form.post("/reviews", {
            onSuccess: () => {
                resetForm();
                setShowConfirmModal(false);
                setIsSubmitting(false);
                setSuccessMessage("Ulasan berhasil dikirim!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrorMessage(
                    errors.content || errors.rating || "Terjadi kesalahan saat mengirim ulasan"
                );
            }
        });
    };

    return {
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
        maxChars: MAX_CHARS
    };
};
