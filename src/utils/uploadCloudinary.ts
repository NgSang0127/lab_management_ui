const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const api_url = import.meta.env.VITE_CLOUDINARY_API_URL;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    const res = await fetch(api_url, {
        method: "POST",
        body: data
    });

    const fileData = await res.json();
    return fileData.url;
};
