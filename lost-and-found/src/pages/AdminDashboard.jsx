import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ChevronDown, ShieldCheck } from 'lucide-react'
import logo from '../assets/logo.png'

function AdminDashboard() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('all') // all | lost | found | pending

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

  useEffect(() => {
    // Replace with your actual Flask endpoint
    fetch('/api/reports')
      .then((res) => res.json())
      .then(setReports)
      .catch(() => setReports([]))
  }, [])

  const filteredReports = reports.filter((r) =>
    filter === 'all' ? true : r.type === filter || r.status === filter
  )

  const handleVerify = (id, decision) => {
    fetch(`/api/reports/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: decision }),
    }).then(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-['Neue_Montreal',_sans-serif]">

      {/* Navbar — same dark-green gradient as the hero, so it reads as "admin" while staying on-brand */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 bg-[radial-gradient(circle_at_20%_20%,#3f5a44_0%,#1f3324_45%,#14231a_100%)] border-b border-black/10 gap-3 md:gap-0">
        <div className="flex items-center gap-2 text-center md:text-left">
          <img src={logo} alt="LostLink logo" className="h-10 w-10 object-contain" />
          <div>
            <h2 className="font-bold text-lg text-white">LostLink</h2>
            <p className="text-xs text-white/60">Admin Console</p>
          </div>
        </div>

        <div ref={panelRef} className="relative">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/85 hover:text-[#FF9A5C] transition-colors text-sm font-medium"
          >
            Admin
            <ChevronDown
              size={14}
              className={`transition-transform ${panelOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {panelOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30">
              <button
                onClick={() => { navigate('/'); setPanelOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Student
              </button>
              <button
                onClick={() => { navigate('/admin'); setPanelOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm bg-orange-50 text-[#FF6D29] font-medium"
              >
                Admin
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="px-6 md:px-16 py-10">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={22} className="text-[#FF6D29]" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">Review reports and verify ownership</p>

        <div className="flex gap-2 mb-6">
          {['all', 'lost', 'found', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                filter === f
                  ? 'bg-[#FF6D29] text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={report.photoUrl}
                  alt={report.itemName}
                  className="h-14 w-14 rounded-xl object-cover bg-gray-100"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{report.itemName}</p>
                  <p className="text-gray-400 text-xs">
                    {report.type} · {report.location} · {report.status}
                  </p>
                </div>
              </div>

              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(report.id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium"
                  >
                    <CheckCircle size={14} /> Verify
                  </button>
                  <button
                    onClick={() => handleVerify(report.id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredReports.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-10">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard