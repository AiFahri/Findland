# Panduan Implementasi Penamaan Gambar Properti

## Masalah
Saat ini, gambar properti disimpan dengan nama acak di `storage/app/public/land_photos`, yang menyebabkan kesulitan dalam mengakses gambar-gambar tersebut di halaman detail properti.

## Solusi
Implementasikan sistem penamaan gambar yang konsisten dengan format:
```
property_[landListingId]_[title]_[number].[extension]
```

Contoh:
```
property_12_JUALTANAHMURAH_1.jpg
property_12_JUALTANAHMURAH_2.jpg
property_12_JUALTANAHMURAH_3.jpg
property_12_JUALTANAHMURAH_4.jpg
```

## Langkah Implementasi

### 1. Import Helper Function
Tambahkan import berikut di bagian atas file `ReviewListing.jsx`:

```jsx
import { generatePropertyImageName } from "@/Utils/imageHelper";
```

### 2. Modifikasi Fungsi `handleImageUpload`
Ubah fungsi `handleImageUpload` untuk menggunakan penamaan yang konsisten:

```jsx
const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dapatkan ekstensi file
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Buat nama file yang konsisten
    const cleanTitle = data.property_details.title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const imageNumber = type === 'main' ? 1 : (data.property_details.images.length + 2);
    const newFileName = generatePropertyImageName(listing.id, cleanTitle, imageNumber, extension);
    
    // Buat FormData dengan nama file baru
    const formData = new FormData();
    formData.append("image", file);
    formData.append("filename", newFileName); // Tambahkan nama file yang diinginkan
    
    try {
        const response = await axios.post(
            route("admin.properties.upload-image"),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const imagePath = response.data.path.replace("/storage/", "");

        if (type === "main") {
            setData("property_details", {
                ...data.property_details,
                image: imagePath,
            });
            setSelectedMainImage(imagePath);
        } else {
            const updatedImages = [
                ...data.property_details.images,
                imagePath,
            ];
            setData("property_details", {
                ...data.property_details,
                images: updatedImages,
            });
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMessage("Failed to upload image. Please try again.");
    }
};
```

### 3. Modifikasi Controller di Backend

Ubah `PropertyController.php` untuk menerima parameter nama file:

```php
public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        'filename' => 'nullable|string',
    ]);

    if ($request->has('filename')) {
        // Gunakan nama file yang diberikan
        $path = $request->file('image')->storeAs('property', $request->filename, 'public');
    } else {
        // Gunakan nama acak seperti sebelumnya
        $path = $request->file('image')->store('property', 'public');
    }

    return response()->json([
        'path' => '/storage/' . $path,
    ]);
}
```

## Keuntungan Implementasi

1. **Konsistensi**: Semua gambar properti akan memiliki format penamaan yang sama
2. **Mudah Diakses**: Frontend dapat dengan mudah memprediksi path gambar berdasarkan ID dan judul
3. **Terorganisir**: Gambar dikelompokkan berdasarkan ID properti
4. **Mudah Dikelola**: Admin dapat dengan mudah mengidentifikasi gambar berdasarkan namanya

## Catatan Tambahan

- Pastikan untuk membersihkan judul dari karakter khusus dan spasi untuk menghindari masalah path
- Batasi jumlah gambar maksimal menjadi 4 sesuai dengan kebutuhan aplikasi
- Gunakan helper function yang telah disediakan untuk konsistensi penamaan
