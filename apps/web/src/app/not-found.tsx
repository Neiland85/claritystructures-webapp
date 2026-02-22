import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6 max-w-md px-6">
        <h1 className="text-6xl font-black">404</h1>
        <h2 className="text-2xl font-bold text-slate-300">Page not found</h2>
        <p className="text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/es"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
