import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Search,
  Bell,
  Users,
  ShoppingBag,
  Backpack,
  Smartphone,
  Headphones,
  GlassWater,
  IdCard,
  ChevronDown,
} from 'lucide-react'
import logo from '../assets/logo.png'

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
  }

  const orbitItems = [
    { id: 'backpack', icon: Backpack, top: 12, left: 18, color: 'text-[#FF9A4C]' },
    { id: 'phone', icon: Smartphone, top: 16, left: 82, color: 'text-slate-200' },
    { id: 'headphones', icon: Headphones, top: 55, left: 6, color: 'text-white' },
    { id: 'bottle', icon: GlassWater, top: 62, left: 92, color: 'text-sky-300' },
    { id: 'id-card', icon: IdCard, top: 90, left: 24, color: 'text-amber-100' },
  ]

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
          {/* Student/Admin dropdown */}
          <div ref={panelRef} className="relative">
            <button
              onClick={() => setPanelOpen((o) => !o)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-700 hover:text-[#FF6D29] transition-colors text-sm font-medium"
            >
              {isAdmin ? 'Admin' : 'Student'}
              <ChevronDown
                size={14}
                className={`transition-transform ${panelOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {panelOpen && (
              <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30">
                <button
                  onClick={() => { navigate('/'); setPanelOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    !isAdmin ? 'bg-orange-50 text-[#FF6D29] font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => { navigate('/admin'); setPanelOpen(false) }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isAdmin ? 'bg-orange-50 text-[#FF6D29] font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            )}
          </div>

          <Link to="/" className="hover:text-[#FF6D29] transition-colors">Home</Link>
          <span onClick={scrollToHowItWorks} className="cursor-pointer hover:text-[#FF6D29] transition-colors">How It Works</span>
          <Link to="/about" className="hover:text-[#FF6D29] transition-colors">About Us</Link>
          <Link to="/reports" className="bg-[#FF6D29] text-white px-4 py-2 rounded-lg hover:bg-[#e85f20] transition-colors">Reports</Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <div className="relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3f5a44_0%,#1f3324_45%,#14231a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/60" />

        <div className="relative z-10 px-6 md:px-16 pt-10 md:pt-14 pb-20 md:pb-24">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

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
                <h1 className="font-['Space_Grotesk',_sans-serif] text-3xl md:text-5xl font-bold text-white leading-tight">
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

            <div className="relative flex flex-col items-center md:items-end gap-3 md:gap-1 mt-10 md:mt-2">
              <p
                className="text-white/80 text-lg rotate-[5deg] text-right hidden md:block md:pr-4"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Same campus. Same community.
                <br />
                Bigger impact. ♡
              </p>

              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                  {orbitItems.map(({ id, top, left }) => (
                    <line
                      key={id}
                      x1="50"
                      y1="50"
                      x2={left}
                      y2={top}
                      stroke="#FF8A4C"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      opacity="0.45"
                    />
                  ))}
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#FF8A4C" strokeWidth="0.4" opacity="0.25" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="#FF8A4C" strokeWidth="0.4" opacity="0.35" strokeDasharray="1.5 2" />
                </svg>

                {orbitItems.map(({ id, top, left, icon: Icon, color }) => (
                  <div
                    key={id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/30"
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    <Icon size={30} strokeWidth={1.75} className={color} />
                  </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-24 w-24 rounded-full bg-[#FF6D29] blur-2xl opacity-40" />
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#FF6D29] to-[#FF9A5C] flex items-center justify-center shadow-xl shadow-orange-900/50">
                    <span className="text-white font-bold text-sm tracking-wide">AI</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 right-0 flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full pl-2 pr-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF8A4C]" />
                  <span className="text-white/80 text-[11px]">Your item is just a match away</span>
                </div>
              </div>
            </div>
          </div>

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