const uploadFile = async (file: File, folder = "general"): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Échec du téléchargement");

  const data: { url: string } = await res.json();
  return data.url;
};

export default uploadFile;
