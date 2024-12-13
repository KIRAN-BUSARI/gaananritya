export default function PageNotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="text-5xl font-bold">
        <span className="flex animate-pulse justify-center text-7xl text-slate-700">
          404
        </span>
        <h1 className="flex text-orange-400">
          Page Not Found <span className="ml-5 animate-bounce">🧐</span>
        </h1>
      </div>
    </div>
  );
}
