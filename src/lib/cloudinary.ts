export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export async function uploadToCloudinaryUnsigned(file: File): Promise<CloudinaryUploadResult> {
  const endpoint = "https://api.cloudinary.com/v1_1/dthtzvypx/image/upload";

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "Joodkids");

  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
  };
}
