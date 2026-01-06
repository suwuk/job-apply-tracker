import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <section
        id="home"
        className="relative px-6 py-12 md:px-10 md:py-20 lg:py-28 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12"
      >
        <div className="flex-1 space-y-6 text-center md:text-left order-2 md:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900">
            Tired of Losing Track of <br className="hidden sm:block" />
            <span className="text-blue-600">Your Job Applications?</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-lg mx-auto md:mx-0">
            Manage all your job applications in one place, stay organized, and
            land your dream job!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 w-full sm:w-auto">
              Get Started – It&apos;s Free!
            </button>
            <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-slate-50 flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-8 border-l-slate-700 border-b-[5px] border-b-transparent ml-1"></span>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md md:max-w-none order-1 md:order-2">
          <Image
            src="/home/home.png"
            alt="Hero Illustration"
            className="w-full h-auto object-contain"
            width={800}
            height={600}
            priority
          />
        </div>
      </section>

      {/* Main Features */}
      <section
        id="features"
        className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Take Control of Your Job Hunt
        </h2>
        <p className="text-sm md:text-base text-slate-500 mb-12 md:mb-20 max-w-2xl mx-auto">
          Keep track of every application and never miss an opportunity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
          {[
            {
              title: "Track Your Progress",
              desc: "All your applications in one simple dashboard.",
              icon: "/home/track-progress.png",
            },
            {
              title: "Set Reminders",
              desc: "Get alerts for upcoming interviews and follow-ups.",
              icon: "/home/reminders.png",
            },
            {
              title: "Organize Easily",
              desc: "Sort by status, company, and deadlines.",
              icon: "/home/organize.png",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full mb-6 flex items-center justify-center group-hover:bg-blue-100 transition-colors p-4">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="w-auto h-auto object-contain"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-slate-500 max-w-xs px-4 sm:px-0">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Key Features
          </h2>
          <p className="text-sm md:text-base text-slate-500 mb-12 md:mb-16">
            Everything you need to stay on top of your job search
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Application Timeline", icon: "/home/timeline.png" },
              { title: "Interview Reminders", icon: "/home/interview.png" },
              { title: "Notes & Documents", icon: "/home/notes-documents.png" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-full aspect-video mb-6 relative overflow-hidden rounded-lg">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-62.5">
                  Monitor your progress step by step and stay ahead of the
                  competition with our smart tools.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section
        id="testimonials"
        className="py-16 md:py-28 px-6 md:px-10 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-16">
          What Our Users Say
        </h2>
        <div className="bg-blue-600 p-8 md:p-14 lg:p-20 rounded-4xl md:rounded-[48px] relative text-white shadow-2xl shadow-blue-200">
          <span className="hidden md:block text-8xl text-blue-400/50 absolute top-4 left-8 font-serif leading-none">
            &ldquo;
          </span>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium italic relative z-10 leading-snug md:leading-relaxed">
            &quot;JobTrackr helped me stay organized and land my dream job.{" "}
            <br className="hidden md:block" />
            <span className="font-bold underline decoration-blue-300 underline-offset-4">
              Highly recommended!
            </span>
            &quot;
          </p>
          <div className="mt-8 md:mt-12 flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 border-2 border-white/50 overflow-hidden backdrop-blur-sm">
              <Image
                src="/foto-profil.png"
                alt="foto profil"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="font-bold text-base md:text-xl">Diaz Aditya Yudha</p>
            <p className="text-blue-100 text-[10px] md:text-sm uppercase tracking-widest font-semibold mt-1">
              Fullstack Developer
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 text-center">
        <div className="flex flex-col items-center">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-4 md:px-14 md:py-5 rounded-2xl font-bold text-lg md:text-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto"
          >
            Sign Up Free
          </Link>
          <p className="mt-6 text-sm md:text-base text-slate-500 font-medium tracking-wide">
            Join 1+ Job Seekers
          </p>
        </div>
      </section>
    </div>
  );
}