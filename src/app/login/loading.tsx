export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-600">
        <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <span>Loading login...</span>
      </div>
    </div>
  );
}
