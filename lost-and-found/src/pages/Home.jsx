import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Search,
  Bell,
  Users,
  ShoppingBag,
  Wifi,
  Signal,
  BatteryFull,
  Home as HomeIcon,
  User,
  Grid3x3,
} from 'lucide-react'
import logo from '../assets/logo.png'

function Home() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
  }

  const quickActions = [
    {
      to: '/report-lost',
      icon: FileText,
      iconBg: 'bg-orange-100 text-[#FF6D29]',
      title: 'I Lost Something',
      subtitle: 'Report your lost item',
    },
    {
      to: '/report-found',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-100 text-emerald-600',
      title: 'I Found Something',
      subtitle: 'Report it and help',
    },
    {
      to: '/match-result',
      icon: Search,
      iconBg: 'bg-violet-100 text-violet-600',
      title: 'Check Status',
      subtitle: 'View your match results',
    },
    {
      to: '/reports',
      icon: Users,
      iconBg: 'bg-amber-100 text-amber-600',
      title: 'Reunite',
      subtitle: 'Connect and get your item back',
    },
  ]

  const steps = [
    {
      icon: FileText,
      badge: 'bg-[#FFE3D0] text-[#FF6D29]',
      title: '1. Report',
      copy: 'Submit details and photo of your item.',
    },
    {
      icon: Search,
      badge: 'bg-[#D9F2E6] text-emerald-600',
      title: '2. AI Matches',
      copy: 'Our AI compares items using image, location, time.',
    },
    {
      icon: Bell,
      badge: 'bg-[#E7E1FB] text-violet-600',
      title: '3. Check Status',
      copy: 'Check your match results and track your item status.',
    },
    {
      icon: Users,
      badge: 'bg-[#FDF0C7] text-amber-600',
      title: '4. Reunite',
      copy: 'Connect and get your item back.',
    },
  ]

  return (
    <div className="min-h-screen bg-white font-['Neue_Montreal',_sans-serif]">

      {/* Navbar */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 bg-white border-b border-gray-200 gap-3 md:gap-0">
        <div className="flex items-center gap-2 text-center md:text-left">
          <img src={logo} alt="LostLink logo" className="h-10 w-10 object-contain" />
          <div>
            <h2 className="font-bold text-lg text-gray-900">LostLink</h2>
            <p className="text-xs text-gray-500">We find. You get it back.</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-gray-700 text-sm">
          <Link to="/" className="hover:text-[#FF6D29] transition-colors">Home</Link>
          <span onClick={scrollToHowItWorks} className="cursor-pointer hover:text-[#FF6D29] transition-colors">How It Works</span>
          <Link to="/about" className="hover:text-[#FF6D29] transition-colors">About Us</Link>
          <Link to="/reports" className="bg-[#FF6D29] text-white px-4 py-2 rounded-lg hover:bg-[#e85f20] transition-colors">Reports</Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <div className="relative overflow-hidden">

        {/* Background photo stand-in — replace with a real campus photo import + a
            bg-cover bg-center style once you have that asset */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3f5a44_0%,#1f3324_45%,#14231a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/60" />

        <div className="relative z-10 px-6 md:px-16 pt-10 md:pt-14 pb-20 md:pb-24">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Left column: copy */}
            <div className="flex flex-col gap-5">
              <span className="inline-block w-fit text-xs tracking-wide font-semibold text-orange-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Campus Lost &amp; Found
              </span>

              <div className="relative">
                <p
                  className="absolute -top-7 left-1 text-white/80 text-lg rotate-[-4deg] hidden md:block"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Lost it? Don't worry! ✏️
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Lost something?
                  <br />
                  <span className="text-[#FF8A4C]">We've got your back.</span>
                </h1>
              </div>

              <p className="text-gray-200 max-w-md">
                A smart lost &amp; found platform to help you find your lost items
                faster and safely on campus.
              </p>
            </div>

            {/* Right column: phone mockup */}
            <div className="relative flex justify-center md:justify-end">
              <p
                className="absolute -top-8 right-2 md:right-6 text-white/80 text-lg rotate-[5deg] text-right hidden md:block"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Same campus. Same community.
                <br />
                Bigger impact. ♡
              </p>

              <div className="relative w-64 rotate-[3deg] rounded-[2.2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-black/50">
                {/* status bar */}
                <div className="flex items-center justify-between px-4 pt-2 pb-1 bg-white rounded-t-[1.6rem] text-[10px] text-gray-900">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Signal size={11} />
                    <Wifi size={11} />
                    <BatteryFull size={12} />
                  </div>
                </div>

                {/* screen content */}
                <div className="bg-white px-4 pb-4 pt-2">
                  <div className="flex items-center gap-1.5 mb-3">
                    <img src={logo} alt="" className="h-5 w-5 object-contain" />
                    <span className="text-xs font-bold text-gray-900">LostLink</span>
                  </div>

                  <p className="text-[13px] font-bold text-gray-900 leading-snug">
                    Lost something?
                  </p>
                  <p className="text-[10px] text-gray-500 mb-2">
                    Report your lost item and get help from our campus community.
                  </p>

                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 mb-2">
                    <div className="h-7 w-7 rounded-md bg-[#FF6D29]/15 flex items-center justify-center">
                      <ShoppingBag size={14} className="text-[#FF6D29]" />
                    </div>
                    <div className="text-[9px] text-gray-500 leading-tight">Backpack near library</div>
                  </div>

                  <button className="w-full bg-[#FF6D29] text-white text-[10px] font-semibold rounded-lg py-2 mb-3">
                    Report Lost Item →
                  </button>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-gray-900">Recent Found Items</span>
                    <span className="text-[8px] text-[#FF6D29]">View all</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-1.5">
                      <div className="h-8 rounded bg-gray-200 mb-1" />
                      <p className="text-[8px] font-medium text-gray-800">Backpack</p>
                      <p className="text-[7px] text-gray-400">Found at Library</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-1.5">
                      <div className="h-8 rounded bg-gray-200 mb-1" />
                      <p className="text-[8px] font-medium text-gray-800">Earbuds</p>
                      <p className="text-[7px] text-gray-400">Found at Cafe</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-gray-400">
                    <HomeIcon size={13} className="text-[#FF6D29]" />
                    <Search size={13} />
                    <Grid3x3 size={13} />
                    <User size={13} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating quick-action cards */}
          <div className="relative z-20 mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ to, icon: Icon, iconBg, title, subtitle }) => (
              <Link
                key={title}
                to={to}
                className="flex items-start gap-3 bg-white/95 backdrop-blur-sm border border-white/60 rounded-2xl px-4 py-4 shadow-lg shadow-black/10 hover:-translate-y-1 transition-transform"
              >
                <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${iconBg}`}>
                  <Icon size={17} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Curved transition into the next section */}
        <svg
          className="absolute -bottom-1 left-0 w-full text-[#FFFBF3]"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32 C240,90 480,90 720,55 C960,20 1200,0 1440,40 L1440,90 L0,90 Z"
          />
        </svg>
      </div>

      {/* ============ HOW IT WORKS ============ */}
      <div id="how-it-works" className="relative bg-[#FFFBF3] px-6 md:px-16 pt-16 pb-20">
        <p
          className="absolute top-6 left-6 md:left-14 text-gray-400 text-lg rotate-[-4deg] hidden md:block"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Small steps,
          <br />
          Big reunions!
        </p>

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-4 max-w-5xl mx-auto">
          {steps.map(({ icon: Icon, badge, title, copy }, i) => (
            <div key={title} className="flex items-center md:items-start gap-4 md:gap-0 w-full md:w-auto">
              <div className="flex flex-col items-center text-center gap-2 w-full md:w-40">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center ${badge}`}>
                  <Icon size={24} />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-gray-500 text-xs leading-snug">{copy}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block text-gray-300 mt-5 mx-2 shrink-0" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home