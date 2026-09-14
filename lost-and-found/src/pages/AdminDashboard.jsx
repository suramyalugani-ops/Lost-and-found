import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'

const API_URL = 'http://localhost:5000'

function AdminDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState('')
  const [verifyStatus, setVerifyStatus] = useState({}) // { itemId: 'verified' | 'rejected' }
  const [activeClaim, setActiveClaim] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setServerError('')
      const response = await fetch(`${API_URL}/api/items`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Fetch items error:', error)
      setServerError('Unable to load reports. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const foundItems = items.filter((i) => i.type?.toLowerCase() === 'found')

  const openClaim = (item) => setActiveClaim(item)

  // Demo-only: updates local state so it looks live in the presentation.
  // Does not write anything back to the backend/database.
  const handleDecision = (itemId, decision) => {
    setVerifyStatus((prev) => ({ ...prev, [itemId]: decision }))
    setActiveClaim(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#FF6D29]" size={22} />
          <h2 className="font-bold text-lg text-gray-900">Admin - LostLink</h2>
        </div>
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF6D29]">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </nav>

      <div className="px-4 md:px-10 py-8">
        <p className="text-xs text-gray-400 mb-6">
          Demo mode - verify actions here are for the presentation only and are not saved to the database yet.
        </p>

        {loading && <p className="text-gray-500 text-sm">Loading reports...</p>}
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        {!loading && !serverError && (
          <>
            <section className="mb-10">
              <h3 className="font-semibold text-gray-900 mb-3">Found item reports - verify ownership</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {foundItems.length === 0 && (
                  <p className="text-sm text-gray-400 p-4">No found-item reports yet.</p>
                )}
                {foundItems.map((item) => {
                  const status = verifyStatus[item.id] || 'pending'
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.category}</p>
                        <p className="text-gray-400 text-xs">{item.location} - {item.date_time}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {status === 'pending' && (
                          <span className="flex items-center gap-1 text-xs text-yellow-600">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                        {status === 'verified' && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle size={14} /> Verified
                          </span>
                        )}
                        {status === 'rejected' && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <XCircle size={14} /> Rejected
                          </span>
                        )}
                        <button
                          onClick={() => openClaim(item)}
                          className="text-xs bg-[#FF6D29] text-white px-3 py-1.5 rounded-lg hover:bg-[#e85f20] transition-colors"
                        >
                          Review claim
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-3">All reports</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.category}</p>
                      <p className="text-gray-400 text-xs">
                        {item.type?.toUpperCase()} - {item.location} - {item.date_time}
                      </p>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-sm text-gray-400 p-4">No reports yet.</p>}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Review claim panel - demo only, updates local state, no backend write */}
      {activeClaim && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h4 className="font-semibold text-gray-900 mb-1">Review ownership claim</h4>
            <p className="text-gray-500 text-sm mb-4">
              A student has claimed this <span className="font-medium text-gray-700">{activeClaim.category}</span> found
              at {activeClaim.location}. Confirm the description matches before releasing the item.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDecision(activeClaim.id, 'rejected')}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleDecision(activeClaim.id, 'verified')}
                className="flex-1 bg-[#FF6D29] text-white py-2 rounded-lg text-sm hover:bg-[#e85f20]"
              >
                Verify &amp; Approve
              </button>
            </div>
            <button
              onClick={() => setActiveClaim(null)}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
