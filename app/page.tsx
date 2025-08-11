'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-wide">Multifactors Sales QMS</div>
        <div className="space-x-6">
          <Link
            href="login"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-indigo-900 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-white text-indigo-900 rounded hover:bg-indigo-200 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto flex-grow px-8 py-20 gap-16">
        <div className="max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Simplify Your <span className="text-yellow-400">Quotation Management</span>
          </h1>
          <p className="mb-8 text-lg opacity-90">
            Manage all your sales quotations in one place — create, revise, approve, and track with ease and security.
          </p>
          <div className="flex gap-6">
            <Link
              href="/LoginPage"
              className="px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded shadow hover:bg-yellow-300 transition"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-indigo-900 transition cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="max-w-md">
          <img
            src="/landing-hero.svg"
            alt="Quotation management illustration"
            className="w-full"
            loading="lazy"
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white text-indigo-900 py-20 px-8 max-w-7xl mx-auto rounded-lg shadow-lg"
      >
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">Create Quotations</h3>
            <p>Build detailed quotes including customer info, pricing, VAT, and notes easily.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Track & Approve</h3>
            <p>Keep track of revisions and approve quotes through an intuitive workflow.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
            <p>Role-based permissions and Firebase authentication protect your data.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-300 py-8 text-center text-sm">
        &copy; {new Date().getFullYear()} Multifactors Sales. All rights reserved.
      </footer>
    </main>
  );
}
