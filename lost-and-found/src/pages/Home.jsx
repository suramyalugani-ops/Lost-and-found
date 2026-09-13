import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, FileText, Brain, Bell, CheckCircle, Search, MapPin, Key, Glasses, Umbrella, Backpack, Watch, Headphones, BookOpen, Compass, HelpCircle } from 'lucide-react'
import bottleImg from '../assets/Bottle.svg'
import notebookImg from '../assets/Notebook.svg'
import walletImg from '../assets/Wallet.svg'

function Home() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className="relative min-h-screen bg-white font-['Neue_Montreal',_sans-serif] overflow-hidden">

      {/* Page-wide decorative doodles — kept along edges/gaps, away from text & icon zones */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top strip (above headline) */}
        <Search className="absolute top-[3%] left-[3%] text-[#FF6D29] opacity-35 rotate-12" size={26} />
        <MapPin className="absolute top-[2%] left-[52%] text-[#FF6D29] opacity-30 -rotate-6" size={22} />
        <Key className="absolute top-[4%] right-[3%] text-[#FF6D29] opacity-30 rotate-45" size={22} />
        <Compass className="absolute top-[9%] left-[20%] text-[#FF6D29] opacity-25 rotate-6" size={18} />

        {/* Left edge, running down beside the headline/buttons */}
        <Glasses className="absolute top-[20%] left-[2%] text-[#FF6D29] opacity-30 rotate-12" size={22} />
        <Umbrella className="absolute top-[30%] left-[3%] text-[#FF6D29] opacity-30 -rotate-12" size={20} />
        <Watch className="absolute top-[40%] left-[2%] text-[#FF6D29] opacity-30 rotate-6" size={20} />
        <BookOpen className="absolute top-[50%] left-[3%] text-[#FF6D29] opacity-25 -rotate-6" size={20} />
        <Backpack className="absolute top-[58%] left-[2%] text-[#FF6D29] opacity-25 rotate-12" size={22} />

        {/* Right edge, running down beside the illustration */}
        <Headphones className="absolute top-[22%] right-[2%] text-[#FF6D29] opacity-30 -rotate-6" size={22} />
        <Key className="absolute top-[32%] right-[3%] text-[#FF6D29] opacity-25 rotate-12" size={18} />
        <HelpCircle className="absolute top-[42%] right-[2%] text-[#FF6D29] opacity-25 rotate-6" size={20} />
        <Search className="absolute top-[52%] right-[3%] text-[#FF6D29] opacity-30 -rotate-12" size={22} />

        {/* Middle gap between hero text column and illustration (empty space) */}
        <MapPin className="absolute top-[55%] left-[48%] text-[#FF6D29] opacity-20 rotate-12" size={18} />

        {/* Gap between hero and "How It Works" heading */}
        <Compass className="absolute top-[62%] left-[8%] text-[#FF6D29] opacity-25 -rotate-6" size={20} />
        <Watch className="absolute top-[63%] right-[8%] text-[#FF6D29] opacity-25 rotate-12" size={20} />

        {/* Around "How It Works" heading, above the icon row */}
        <BookOpen className="absolute top-[68%] left-[15%] text-[#FF6D29] opacity-25 rotate-6" size={18} />
        <Umbrella className="absolute top-[68%] right-[15%] text-[#FF6D29] opacity-25 -rotate-6" size={18} />

        {/* Between the 4 "How It Works" columns (gaps, not on top of the icons) */}
        <Search className="absolute top-[76%] left-[24%] text-[#FF6D29] opacity-25 rotate-12" size={16} />
        <Key className="absolute top-[76%] left-[49%] text-[#FF6D29] opacity-25 -rotate-12" size={16} />
        <Glasses className="absolute top-[76%] left-[74%] text-[#FF6D29] opacity-25 rotate-6" size={16} />

        {/* Bottom edges below the whole section */}
        <Backpack className="absolute top-[90%] left-[4%] text-[#FF6D29] opacity-25 rotate-12" size={20} />
        <Headphones className="absolute top-[92%] right-[4%] text-[#FF6D29] opacity-25 -rotate-6" size={20} />
        <HelpCircle className="absolute top-[97%] left-[45%] text-[#FF6D29] opacity-20 rotate-6" size={16} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 bg-white border-b border-gray-200 gap-3 md:gap-0">
        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg text-gray-900">404 Not Lost</h2>
          <p className="text-xs text-gray-500">We find. You get it back.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-gray-700 text-sm">
          <Link to="/" className="hover:text-[#FF6D29] transition-colors">Home</Link>
          <span onClick={scrollToHowItWorks} className="cursor-pointer hover:text-[#FF6D29] transition-colors">How It Works</span>
          <Link to="/about" className="hover:text-[#FF6D29] transition-colors">About Us</Link>
          <Link to="/reports" className="bg-[#FF6D29] text-white px-4 py-2 rounded-lg hover:bg-[#e85f20] transition-colors">Reports</Link>
        </div>
      </nav>

      {/* Hero section - 2 columns on desktop, stacked on mobile */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 py-10 md:py-16 gap-8 overflow-hidden">

        {/* Decorative background blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FF6D29] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#FF6D29] opacity-[0.07] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-orange-200 opacity-20 blur-3xl pointer-events-none"></div>

        {/* Left column: text */}
        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Lost something? <span className="text-[#FF6D29]">We've got your back.</span>
          </h1>
          <p className="text-gray-600 max-w-md">
            A smart lost & found platform to help you find your lost items faster and safely on campus.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Link to="/report-lost" className="flex items-center justify-between bg-orange-50 border border-[#FF6D29]/40 px-5 py-4 rounded-xl w-full md:w-64 hover:border-[#FF6D29] transition-colors">
               <div className="flex items-center gap-3">
                <ShoppingBag className="text-red-500" size={22} />
                <div>
                  <p className="text-red-600 font-semibold">I Lost Something</p>
                  <p className="text-gray-400 text-xs">Report your lost item</p>
                </div>
              </div>
              <ArrowRight className="text-[#FF6D29]" size={20} />
            </Link>

            <Link to="/report-found" className="flex items-center justify-between bg-gray-50 border border-gray-300 px-5 py-4 rounded-xl w-full md:w-64 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-green-500" size={22} />
                <div>
                  <p className="text-green-600 font-semibold">I Found Something</p>
                  <p className="text-gray-400 text-xs">Report it and help</p>
                </div>
              </div>
              <ArrowRight className="text-gray-700" size={20} />
            </Link>
            <Link to="/match-result" className="flex items-center justify-between bg-yellow-50 border border-yellow-300 px-5 py-4 rounded-xl w-full md:w-64 hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-3">
                <Search className="text-yellow-600" size={22} />
                <div>
                  <p className="text-yellow-700 font-semibold">Check Status</p>
                  <p className="text-gray-400 text-xs">View your match results</p>
                </div>
              </div>
              <ArrowRight className="text-yellow-600" size={20} />
            </Link>
          </div>
        </div>

        {/* Right column: illustration */}
        <div
          className="relative z-10 bg-gradient-to-br from-orange-50 to-orange-100 h-56 md:h-72 flex items-center justify-center gap-1 md:gap-2 p-4 md:p-6 overflow-hidden"
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 15%, 100% 100%, 8% 100%, 0 85%)' }}
        >
          <img src={notebookImg} alt="Notebook" className="h-36 md:h-52 -mr-6 md:-mr-10" />
          <img src={bottleImg} alt="Water bottle" className="h-28 md:h-44 -mr-4 md:-mr-8 z-10" />
          <img src={walletImg} alt="Wallet" className="h-28 md:h-40 -mr-6 md:-mr-10" />
        </div>

      </div>

      {/* How It Works */}
      <div id="how-it-works" className="relative z-10 text-center px-6 md:px-16 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="flex flex-col items-center gap-2">
            <FileText className="text-[#FF6D29]" size={28} />
            <p className="font-semibold text-gray-900">1. Report</p>
            <p className="text-gray-500 text-sm">Submit details and photo of your item.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Brain className="text-[#FF6D29]" size={28} />
            <p className="font-semibold text-gray-900">2. AI Matches</p>
            <p className="text-gray-500 text-sm">Our AI compares items using image, location, time.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Bell className="text-[#FF6D29]" size={28} />
            <p className="font-semibold text-gray-900">3. Check Status</p>
            <p className="text-gray-500 text-sm"> Check your match results and track your item status.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="text-[#FF6D29]" size={28} />
            <p className="font-semibold text-gray-900">4. Reunite</p>
            <p className="text-gray-500 text-sm">Connect and get your item back.</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Home