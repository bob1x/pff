interface Props {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  uploadError: string | null;
  onUpload: () => void;
}

export function ResumeUploadForm({
  fullName,
  setFullName,
  email,
  setEmail,
  file,
  onFileChange,
  uploading,
  uploadError,
  onUpload,
}: Props) {
  return (
    <section className="bg-white shadow p-6 rounded">
      <h2 className="text-lg font-semibold mb-4">Your Details</h2>

      <div className="grid gap-4 mb-6">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="file" accept="application/pdf" onChange={onFileChange} />

        {uploadError && <p className="text-red-500">{uploadError}</p>}

        <button
          onClick={onUpload}
          disabled={!file || uploading}
          className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload & Edit Resume"}
        </button>
      </div>
    </section>
  );
}
