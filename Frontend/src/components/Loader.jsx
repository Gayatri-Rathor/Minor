function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center animate-pulse-soft">
        <p className="text-3xl mb-2">⏳</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;