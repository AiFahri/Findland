/**
 * Fungsi untuk menghasilkan nama file gambar properti yang konsisten
 * Format: property_[landListingId]_[title]_[number].[extension]
 *
 * @param {number} landListingId - ID dari land listing
 * @param {string} title - Judul properti
 * @param {number} number - Nomor urut gambar (1-4)
 * @param {string} extension - Ekstensi file (jpg, png, dll)
 * @returns {string} Nama file yang dihasilkan
 */
export const generatePropertyImageName = (
    landListingId,
    title,
    number,
    extension = ""
) => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const imageNumber = Math.min(Math.max(parseInt(number), 1), 4);

    if (!extension) {
        return `property_${landListingId}_${cleanTitle}_${imageNumber}`;
    }

    const cleanExtension = extension.replace(/^\./, "");
    return `property_${landListingId}_${cleanTitle}_${imageNumber}.${cleanExtension}`;
};

/**
 * Fungsi untuk menghasilkan array path gambar properti
 *
 * @param {number} landListingId - ID dari land listing
 * @param {string} title - Judul properti
 * @param {number} count - Jumlah gambar (max 4)
 * @param {string} extension - Ekstensi file (jpg, png, dll)
 * @returns {Array} Array path gambar
 */
export const generatePropertyImagePaths = (
    landListingId,
    title,
    count = 4,
    extension = ""
) => {
    const paths = [];
    const imageCount = Math.min(Math.max(parseInt(count), 1), 4);

    for (let i = 1; i <= imageCount; i++) {
        paths.push(
            generatePropertyImageName(landListingId, title, i, extension)
        );
    }

    return paths;
};

/**
 * Fungsi untuk menghasilkan array path lengkap gambar properti
 *
 * @param {number} landListingId - ID dari land listing
 * @param {string} title - Judul properti
 * @param {number} count - Jumlah gambar (max 4)
 * @param {string} extension - Ekstensi file (jpg, png, dll)
 * @returns {Array} Array path gambar lengkap
 */
export const generateFullPropertyImagePaths = (
    landListingId,
    title,
    count = 4,
    extension = ""
) => {
    const fileNames = generatePropertyImagePaths(
        landListingId,
        title,
        count,
        extension
    );

    return fileNames.map((fileName) => {
        if (!extension) {
            return [
                `/storage/property/${fileName}.jpg`,
                `/storage/${fileName}.jpg`,
                `/assets/property/${fileName}.jpg`,
                `/assets/${fileName}.jpg`,
                `/storage/property/${fileName}.png`,
                `/storage/${fileName}.png`,
                `/assets/property/${fileName}.png`,
                `/assets/${fileName}.png`,
                `/storage/property/${fileName}.jpeg`,
                `/storage/${fileName}.jpeg`,
                `/assets/property/${fileName}.jpeg`,
                `/assets/${fileName}.jpeg`,
            ];
        }

        return [
            `/storage/property/${fileName}`,
            `/storage/${fileName}`,
            `/assets/property/${fileName}`,
            `/assets/${fileName}`,
        ];
    });
};
