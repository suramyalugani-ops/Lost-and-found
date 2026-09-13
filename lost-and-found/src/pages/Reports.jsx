import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Plus, X, CheckCircle } from 'lucide-react'

const API_URL = 'http://localhost:5000'

function Reports() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const [formData, setFormData] = useState({
    item: '',
    status: 'Lost',
    location: '',
    date: '',
  })

  const [errors, setErrors] = useState({})

  // =========================
  // GET ALL REPORTS
  // =========================
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
  try {
    setLoading(true)
    setServerError('')

    const response = await fetch(`${API_URL}/api/items`)

    if (!response.ok) {
      throw new Error('Failed to fetch reports')
    }

    const data = await response.json()

    // Backend returns:
    // { success: true, items: [...] }

    const formattedReports = (data.items || []).map((item) => ({
      id: item.id,
      item: item.category,
      status:
        item.type?.toLowerCase() === 'found'
          ? 'Found'
          : 'Lost',
      location: item.location,
      date: item.date_time
        ? item.date_time.split(' ')[0]
        : '',
    }))

    setReports(formattedReports)

  } catch (error) {
    console.error('Fetch reports error:', error)

    setServerError(
      'Unable to load reports. Please make sure the backend is running.'
    )

  } finally {
    setLoading(false)
  }
}
  // =========================
  // ESCAPE KEY
  // =========================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false)
      }
    }

    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredReports = reports
    .filter(
      (r) => filter === 'All' || r.status === filter
    )
    .filter((r) =>
      searchQuery.trim() === ''
        ? true
        : r.item
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          r.location
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )

  // =========================
  // FORM INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    setErrors({
      ...errors,
      [e.target.name]: '',
    })

    setServerError('')
  }

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    const newErrors = {}

    if (!formData.item.trim()) {
      newErrors.item = 'Item name is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    return newErrors
  }

  // =========================
  // SUBMIT REPORT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)
      setServerError('')

      const formDataToSend = new FormData()

      /*
        Convert frontend values to backend values
      */

      formDataToSend.append(
        'type',
        formData.status.toLowerCase()
      )

      formDataToSend.append(
        'category',
        formData.item
      )

      formDataToSend.append(
        'location',
        formData.location
      )

      formDataToSend.append(
        'date',
        formData.date
      )

      // Report.jsx doesn't currently have a time field
      formDataToSend.append(
        'time',
        '00:00'
      )

      // Required backend fields
      formDataToSend.append(
        'description',
        formData.item
      )

      formDataToSend.append(
        'name',
        'Anonymous'
      )

      formDataToSend.append(
        'phone',
        ''
      )

      // =========================
      // SEND TO FLASK
      // =========================

      const response = await fetch(
        `${API_URL}/api/report`,
        {
          method: 'POST',
          body: formDataToSend,
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Failed to submit report'
        )
      }

      console.log(
        'Report successfully submitted:',
        data
      )

      // =========================
      // ADD BACKEND REPORT TO UI
      // =========================

      const newReport = {
        id: data.item_id,
        item: formData.item,
        status: formData.status,
        location: formData.location,
        date: formData.date,
      }

      setReports((prevReports) => [
        newReport,
        ...prevReports,
      ])

      // =========================
      // RESET FORM
      // =========================

      setFormData({
        item: '',
        status: 'Lost',
        location: '',
        date: '',
      })

      setErrors({})
      setShowForm(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)

    } catch (error) {
      console.error(
        'Submit report error:',
        error
      )

      setServerError(
        error.message ||
          'Something went wrong while submitting the report.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-['Neue_Montreal',_sans-serif]">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 bg-white border-b border-gray-200 gap-3 md:gap-0">

        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg text-gray-900">
            404 Not Lost
          </h2>

          <p className="text-xs text-gray-500">
            We find. You get it back.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-gray-700 text-sm">

          <Link
            to="/"
            className="hover:text-[#FF6D29] transition-colors"
          >
            Home
          </Link>

          <Link
            to="/#how-it-works"
            className="hover:text-[#FF6D29] transition-colors"
          >
            How It Works
          </Link>

          <Link
            to="/about"
            className="hover:text-[#FF6D29] transition-colors"
          >
            About Us
          </Link>

          <Link
            to="/reports"
            className="bg-[#FF6D29] text-white px-4 py-2 rounded-lg hover:bg-[#e85f20] transition-colors"
          >
            Reports
          </Link>

        </div>
      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <div className="text-center px-6 md:px-16 py-10">

        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">

          All{' '}

          <span className="text-[#FF6D29]">
            Reports
          </span>

        </h1>

        <p className="text-gray-600 mt-2">
          Browse all lost and found item reports on campus.
        </p>

      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {showSuccess && (
        <div className="flex justify-center mb-4">

          <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg">

            <CheckCircle size={16} />

            Report added successfully!

          </div>

        </div>
      )}

      {/* =========================
          SERVER ERROR
      ========================= */}

      {serverError && (
        <div className="flex justify-center px-6 mb-4">

          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg text-center max-w-md">
            {serverError}
          </div>

        </div>
      )}

      {/* =========================
          SEARCH
      ========================= */}

      <div className="flex justify-center px-6 mb-6">

        <div className="relative w-full max-w-md">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />

          <input
            type="text"
            placeholder="Search by item or location..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#FF6D29]"
          />

        </div>

      </div>

      {/* =========================
          FILTERS + ADD BUTTON
      ========================= */}

      <div className="flex flex-col md:flex-row justify-center items-center gap-3 px-6 mb-8">

        <div className="flex gap-3">

          {['All', 'Lost', 'Found'].map(
            (tab) => (

              <button
                key={tab}
                onClick={() =>
                  setFilter(tab)
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  filter === tab
                    ? 'bg-[#FF6D29] text-white border-[#FF6D29]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#FF6D29]/50'
                }`}
              >
                {tab}
              </button>

            )
          )}

        </div>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-[#FF6D29] text-white hover:bg-[#e85f20] transition-colors"
        >

          <Plus size={16} />

          Add Report

        </button>

      </div>

      {/* =========================
          ADD REPORT MODAL
      ========================= */}

      {showForm && (

        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="bg-white rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              onClick={() =>
                setShowForm(false)
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Add New Report
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
              noValidate
            >

              {/* ITEM */}

              <div>

                <input
                  type="text"
                  name="item"
                  placeholder="Item name (e.g. Black Wallet)"
                  value={formData.item}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.item
                      ? 'border-red-400'
                      : 'border-gray-300 focus:border-[#FF6D29]'
                  }`}
                />

                {errors.item && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.item}
                  </p>
                )}

              </div>

              {/* STATUS */}

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6D29]"
              >

                <option value="Lost">
                  Lost
                </option>

                <option value="Found">
                  Found
                </option>

              </select>

              {/* LOCATION */}

              <div>

                <input
                  type="text"
                  name="location"
                  placeholder="Location (e.g. Library)"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.location
                      ? 'border-red-400'
                      : 'border-gray-300 focus:border-[#FF6D29]'
                  }`}
                />

                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location}
                  </p>
                )}

              </div>

              {/* DATE */}

              <div>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.date
                      ? 'border-red-400'
                      : 'border-gray-300 focus:border-[#FF6D29]'
                  }`}
                />

                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.date}
                  </p>
                )}

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className={`mt-2 text-white py-2 rounded-lg text-sm font-medium transition-colors ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#FF6D29] hover:bg-[#e85f20]'
                }`}
              >

                {submitting
                  ? 'Submitting...'
                  : 'Submit Report'}

              </button>

            </form>

          </div>

        </div>
      )}

      {/* =========================
          REPORTS LIST
      ========================= */}

      <div className="px-6 md:px-16 pb-20 max-w-3xl mx-auto flex flex-col gap-4">

        {loading ? (

          <p className="text-center text-gray-400 mt-10">
            Loading reports...
          </p>

        ) : filteredReports.length > 0 ? (

          filteredReports.map(
            (report) => (

              <div
                key={report.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-[#FF6D29]/40 transition-colors"
              >

                <div className="flex items-center gap-3">

                  <Search
                    className="text-[#FF6D29]"
                    size={20}
                  />

                  <div>

                    <p className="font-semibold text-gray-900">
                      {report.item}
                    </p>

                    <div className="flex items-center gap-4 text-gray-500 text-xs mt-1">

                      <span className="flex items-center gap-1">

                        <MapPin size={12} />

                        {report.location}

                      </span>

                      <span className="flex items-center gap-1">

                        <Calendar size={12} />

                        {report.date}

                      </span>

                    </div>

                  </div>

                </div>

                <span
                  className={`self-start md:self-auto text-xs font-semibold px-3 py-1 rounded-full ${
                    report.status === 'Lost'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >

                  {report.status}

                </span>

              </div>

            )
          )

        ) : (

          <p className="text-center text-gray-400 mt-10">
            No reports found.
          </p>

        )}

      </div>

    </div>
  )
}

export default Reports