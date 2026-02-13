  "use client";

  import Link from "next/link";
  import Image from "next/image";

  export default function Home() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header with Logo and Title */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Logo Display with ncc.jpg */}
            <div className="relative">
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-green-900/30 rounded-xl p-2">
                <div className="w-48 h-48 md:w-56 md:h-56 relative">
                  {/* ncc.jpg image - with fallback */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src="/ncc.jpg"
                      alt="NCC_MSJ Logo"
                      fill
                      className="object-contain p-2"
                      priority
                      sizes="(max-width: 768px) 192px, 224px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = document.getElementById("logo-fallback");
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    {/* Fallback if image fails to load */}
                    <div
                      id="logo-fallback"
                      className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-800/20 rounded-lg flex items-center justify-center hidden"
                    >
                      <span className="text-6xl font-bold text-green-400">
                        NCC
                      </span>
                    </div>
                    {/* Green overlay for tech aesthetic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-emerald-800/10" />
                  </div>

                  {/* Animated border effect */}
                  <div className="absolute inset-0 border border-green-500/20 rounded-lg animate-pulse" />
                </div>

                {/* Outer glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-400/20 rounded-xl blur-xl -z-10" />
              </div>

              {/* Logo Label */}
              <div className="text-center mt-4">
                <p className="text-green-400/80 text-sm font-mono tracking-wider">
                  NCC_TECH_PLATFORM
                </p>
              </div>
            </div>

            {/* Platform Title */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-green-400">NCC_MSJ</span>
                <span className="text-white"> Tech</span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-400 mx-auto md:mx-0 mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-300">
                Management System
              </h2>
            </div>
          </div>

          {/* Platform Description */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed">
              A{" "}
              <span className="text-green-400 font-semibold">
                secure, professional system
              </span>{" "}
              for managing members, attendance tracking, achievement records, and
              course coordination — engineered with modern web technologies.
            </p>

            {/* Tech Stack Indicators */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                "Next.js 14",
                "React 18",
                "TypeScript",
                "Tailwind CSS",
                "MongoDB",
                "JWT Auth",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-gray-800/50 border border-green-900/30 rounded-full text-green-300 text-sm hover:bg-green-900/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-gradient-to-r from-green-700 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-900/50 active:scale-95"
            >
              <span className="text-white font-bold text-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Platform Login
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-green-400/30 rounded-full blur-sm group-hover:w-full transition-all duration-300" />
            </Link>

            <Link
              href="/register"
              className="group relative px-8 py-4 border-2 border-green-600/50 rounded-xl hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="text-green-300 font-bold text-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Register Access
              </span>
              <div className="absolute -inset-1 border border-green-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gray-900/30 border border-green-900/20 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Member Management
              </h3>
              <p className="text-gray-400 text-sm">
                Track and manage NCC cadet profiles efficiently
              </p>
            </div>

            <div className="p-6 bg-gray-900/30 border border-green-900/20 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Attendance Tracking
              </h3>
              <p className="text-gray-400 text-sm">
                Monitor participation in drills and events
              </p>
            </div>

            <div className="p-6 bg-gray-900/30 border border-green-900/20 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Achievement Records
              </h3>
              <p className="text-gray-400 text-sm">
                Document and verify cadet accomplishments
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              <span className="text-green-500/70">Secure Platform</span> •
              <span className="font-mono text-gray-400 ml-2">v2.4.1</span>
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Encrypted communication • Secure authentication • Professional
              management
            </p>
          </div>

          {/* Animated background elements without styled-jsx */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute font-mono text-green-900/10 text-xl animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {Math.random() > 0.5 ? "1" : "0"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
