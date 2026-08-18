import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-24 pb-20 min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <Link
        href="/"
        className="btn-primary px-8 py-3 rounded-xl font-semibold text-black"
      >
        Go Home
      </Link>
    </div>
  );
}
