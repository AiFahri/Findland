export function formatRupiah(number) {
    const cleanNumber =
        typeof number === "string" ? number.replace("Rp", "").trim() : number;

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(cleanNumber);
}

export function truncateText(text, maxLength = 100) {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength).trim() + "..."
        : text;
}
