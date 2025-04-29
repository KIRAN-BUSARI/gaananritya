export default function PageNotFound() {
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="text-5xl font-bold">
        <span className="flex justify-center text-7xl text-secondary1">
          404
        </span>
        <h1 className="flex text-secondary">
          Page is getting ready <span className="ml-5 animate-bounce">😎</span>
        </h1>
      </div>
    </div>
  );
}
