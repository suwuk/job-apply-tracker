import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <section
        id="home"
        className="relative px-6 md:px-10 py-12 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12"
      >
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900">
            Tired of Losing Track of <br className="hidden sm:block" />
            <span className="text-blue-600">Your Job Applications?</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-lg mx-auto md:mx-0">
            Manage all your job applications in one place, stay organized, and
            land your dream job!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              Get Started – It&apos;s Free!
            </button>
            <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm md:text-base hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
              <span className="w-0 h-0 border-t-[5px] border-t-transparent border-l-8 border-l-slate-700 border-b-[5px] border-b-transparent ml-1"></span>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl md:max-w-none">
          <Image
            src="/home/home.png"
            alt="Hero Illustration"
            className="w-full h-full object-cover"
            width={800}
            height={600}
          />
        </div>
      </section>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
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
              <div className="w-20 h-20 md:w-25 md:h-25 bg-blue-50 rounded-full mb-6 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Image
                  src={item.icon}
                  alt="Track Progress"
                  width={500}
                  height={300}
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-slate-500 max-w-62.5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Key Features
          </h2>
          <p className="text-sm md:text-base text-slate-500 mb-12 md:mb-16">
            Everything you need to stay on top of your job search
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Application Timeline", icon: "/home/timeline.png" },
              { title: "Interview Reminders", icon: "/home/interview.png" },
              { title: "Notes & Documents", icon: "/home/notes-documents.png" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-video mb-6">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    width={250}
                    height={130}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Monitor your progress step by step and stay ahead of the
                  competition with our smart tools.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section
        id="testimonials"
        className="py-20 md:py-28 px-6 md:px-10 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-12 md:mb-16">
          What Our Users Say
        </h2>
        <div className="bg-blue-600 p-8 md:p-14 rounded-4xl md:rounded-[48px] relative text-white shadow-2xl shadow-blue-200">
          <span className="hidden sm:block text-7xl md:text-8xl text-blue-400/50 absolute top-4 left-8 font-serif leading-none">
            “
          </span>
          <p className="text-lg md:text-2xl lg:text-3xl font-medium italic relative z-10 leading-snug md:leading-relaxed">
            &quot;JobTrackr helped me stay organized and land my dream job.{" "}
            <br className="hidden md:block" />
            <span className="font-bold underline decoration-blue-300 underline-offset-4">
              Highly recommended!
            </span>
            &quot;
          </p>
          <div className="mt-8 md:mt-12 flex flex-col items-center">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 border-2 border-white/50 overflow-hidden backdrop-blur-sm">
              <Image
                src="/foto-profil.png"
                alt="foto"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="font-bold text-base md:text-xl">Diaz Aditya Yudha</p>
            <p className="text-blue-100 text-xs md:text-sm uppercase tracking-widest font-semibold mt-1">
              Fullstack Developer
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 text-center">
        <Link
          href="/register"
          className="bg-blue-600 text-white px-10 py-4 md:px-14 md:py-5 rounded-2xl font-bold text-lg md:text-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
        >
          Sign Up Free
        </Link>
        <p className="mt-6 text-sm md:text-base text-slate-500 font-medium tracking-wide">
          {/* No Credit Card Required • Join 10,000+ Job Seekers */}
          Join 1+ Job Seekers
        </p>
      </section>
    </div>
  );
}
