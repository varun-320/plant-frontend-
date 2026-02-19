"use client";
import { useState } from "react";
import axios from "axios";

export default function FlowerAI() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ flower: string; confidence: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };
 
  const identifyFlower = async () => {
    if (!selectedImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post("http://localhost:8080/api/identify", formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error: Is Spring Boot running on Port 8080?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <h1 className="text-4xl font-black text-slate-800 text-center mb-2 tracking-tight">
          Flower<span className="text-emerald-500">Scan</span>
        </h1>
        <p className="text-slate-500 text-center mb-8 font-medium">AI Plant Identification</p>

        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-6 bg-slate-50/50">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-inner" />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium text-center">
              Select a flower image <br/> to begin
            </div>
          )}
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            accept="image/*"
          />
        </div>

        <button 
          onClick={identifyFlower}
          disabled={!selectedImage || loading}
          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xl hover:bg-emerald-600 transition-all disabled:bg-slate-200"
        >
          {loading ? "AI is Analyzing..." : "Identify Species"}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
            <h3 className="text-emerald-600 font-bold uppercase text-xs tracking-widest mb-1">AI Match Found</h3>
            <p className="text-4xl font-black text-slate-800">{result.flower}</p>
            <p className="text-emerald-700 font-bold mt-2">Confidence: {result.confidence}</p>
          </div>
        )}
      </div>
    </main>
  );
}