import { Link } from 'react-router-dom'
import { Target, Users, Sparkles, ArrowRight } from 'lucide-react'

const team = [
  { name: 'Harshita', role: 'Frontend' },
  { name: 'Pari', role: 'Frontend' },
  { name: 'Naina', role: 'Backend' },
  { name: 'Suramya', role: 'Backend' },
  { name: 'Avantika', role: 'PPT & Presentation' },
  { name: 'Suhani', role: 'PPT & Presentation' },
]

const avatarGradients = [
  'from-[#FF6D29] to-orange-300',
  'from-orange-400 to-pink-300',
  'from-amber-400 to-orange-300',
  'from-orange-500 to-yellow-300',
  'from-rose-400 to-orange-300',
  'from-orange-400 to-amber-200',
]

function AboutUs() {
  return (
    <div className="min-h-screen bg-white font-['Neue_Montreal',_sans-serif]">

      {/* Navbar */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 bg-white border-b border-gray-200 gap-3 md:gap-0">
        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg text-gray-900">404 Not Lost</h2>
          <p className="text-xs text-gray-500">We find. You get it back.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-gray-700 text-sm">
          <Link to="/" className="hover:text-[#FF6D29] transition-colors">Home</Link>
          <Link to="/#how-it-works" className="hover:text-[#FF6D29] transition-colors">How It Works</Link>
          <Link to="/about" className="text-[#FF6D29] font-semibold">About Us</Link>
          <Link to="/reports" className="bg-[#FF6D29] text-white px-4 py-2 rounded-lg hover:bg-[#e85f20] transition-colors">Reports</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center px-6 md:px-16 py-12 md:py-16">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          About <span className="text-[#FF6D29]">404 Not Lost</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mt-4">
          A student-built project to make finding lost items on campus faster,
          smarter, and less stressful for everyone.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['AI-Powered Matching', 'Built for Campus'].map((stat) => (
            <span
              key={stat}
              className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"
            >
              {stat}
            </span>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16 pb-16">
        <div className="flex flex-col items-center text-center gap-3 bg-orange-50 border border-[#FF6D29]/20 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Target className="text-[#FF6D29]" size={22} />
          </div>
          <p className="font-semibold text-gray-900">Our Mission</p>
          <p className="text-gray-500 text-sm">
            Replace scattered WhatsApp groups and word-of-mouth with one
            reliable place to report and find lost items on campus.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-3 bg-orange-50 border border-[#FF6D29]/20 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Sparkles className="text-[#FF6D29]" size={22} />
          </div>
          <p className="font-semibold text-gray-900">How We Help</p>
          <p className="text-gray-500 text-sm">
            AI-powered matching compares lost and found reports by image,
            location, and time so items get back to owners faster.
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-3 bg-orange-50 border border-[#FF6D29]/20 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Users className="text-[#FF6D29]" size={22} />
          </div>
          <p className="font-semibold text-gray-900">Built By Students</p>
          <p className="text-gray-500 text-sm">
            Made by a student team for a college hackathon, with real
            campus problems in mind.
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="text-center px-6 md:px-16 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all hover:border-[#FF6D29]/50 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
              >
                {member.name.charAt(0)}
              </div>
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-gray-500 text-xs">{member.role}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}

export default AboutUs