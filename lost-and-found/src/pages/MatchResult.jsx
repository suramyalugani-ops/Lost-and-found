import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Share2,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Search,
  Flag,
  ImageIcon,
} from 'lucide-react'

const API_URL = 'http://localhost:5000'

function MatchResult() {
  const navigate = useNavigate()
  const location = useLocation()

  const [item, setItem] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Get item ID from navigation state OR localStorage
  const itemId =
    location.state?.itemId ||
    localStorage.getItem('lastReportId')

  // =========================
  // FETCH MATCHES FROM BACKEND
  // =========================

  useEffect(() => {
    const fetchMatches = async () => {
      if (!itemId) {
        setError('No report ID was provided.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/items/${itemId}/matches`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch matches'
          )
        }

        setItem(data.item)
        setMatches(data.matches || [])

      } catch (err) {
        console.error('Match fetch error:', err)

        setError(
          err.message ||
          'Unable to load match results.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [itemId])

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Neue_Montreal',_sans-serif]">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-orange-200 border-t-[#FF6D29] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Finding the best matches...
          </p>

        </div>

      </div>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 font-['Neue_Montreal',_sans-serif]">

        <div className="text-center max-w-md">

          <div className="text-red-500 mb-3">
            <Search size={40} className="mx-auto" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load matches
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate('/')}
            className="bg-[#FF6D29] text-white px-5 py-2 rounded-lg text-sm"
          >
            Back to Home
          </button>

        </div>

      </div>
    )
  }

  // =========================
  // BEST MATCH
  // =========================

  const bestMatch =
    matches.length > 0
      ? matches[0]
      : null

  const score = bestMatch
    ? Number(bestMatch.score || 0)
    : 0

  // Show only 2 decimal places
  const formattedScore = score.toFixed(2)

  const circumference = 2 * Math.PI * 54

  const offset =
    circumference -
    (score / 100) * circumference

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 md:px-6 font-['Neue_Montreal',_sans-serif]">

      <div className="max-w-5xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#FF6D29] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <button
            onClick={async () => {

              const shareData = {
                title: '404 Not Lost — Match Result',
                text: 'I found a potential match for my lost item!',
                url: window.location.href,
              }

              if (navigator.share) {

                try {
                  await navigator.share(shareData)
                } catch (err) {
                  // User cancelled
                }

              } else {

                await navigator.clipboard.writeText(
                  window.location.href
                )

                alert('Link copied to clipboard!')
              }

            }}
            className="flex items-center gap-2 text-[#FF6D29] border border-[#FF6D29]/40 px-4 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors"
          >

            <Share2 size={16} />

            Share Result

          </button>

        </div>

        {/* =========================
            HERO
        ========================= */}

        <div className="relative bg-gradient-to-br from-orange-50 to-white border border-[#FF6D29]/15 rounded-2xl px-6 md:px-10 py-10 mb-8 overflow-hidden">

          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#FF6D29] opacity-[0.06] blur-3xl pointer-events-none"></div>

          <div className="relative flex items-center gap-2 justify-center md:justify-start mb-2">

            <Sparkles
              className="text-[#FF6D29]"
              size={18}
            />

            <span className="text-[#FF6D29] text-xs font-semibold uppercase tracking-wide">
              {bestMatch
                ? 'AI Match Found'
                : 'No Match Found'}
            </span>

          </div>

          <h1 className="relative text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left mb-1">

            {bestMatch ? (
              <>
                We've found a{' '}
                <span className="text-[#FF6D29]">
                  potential match!
                </span>
              </>
            ) : (
              <>
                No matching item{' '}
                <span className="text-[#FF6D29]">
                  found yet.
                </span>
              </>
            )}

          </h1>

          <p className="relative text-gray-500 text-center md:text-left mb-8 max-w-lg">

            {bestMatch
              ? 'Our AI compared your item with reported items using image, location, category, description and time.'
              : 'We could not find a matching item at the moment. You can continue searching for new reports.'}

          </p>

          {/* =========================
              SCORE
          ========================= */}

          {bestMatch && (

            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Circular Progress */}

              <div className="relative w-36 h-36 shrink-0">

                <svg
                  className="w-36 h-36 -rotate-90"
                  viewBox="0 0 120 120"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="10"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />

                </svg>

                {/* Score inside circle */}

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                    {formattedScore}%
                  </span>

                  <span className="text-[11px] text-green-600 font-semibold">
                    Match Score
                  </span>

                </div>

              </div>

              {/* =========================
                  MATCH DETAILS
              ========================= */}

              <div className="flex-1 w-full bg-white rounded-xl border border-gray-100 shadow-sm p-5">

                <p className="font-bold text-green-600 mb-1">

                  {score >= 80
                    ? 'Highly Likely Match'
                    : score >= 60
                    ? 'Possible Match'
                    : 'Low Confidence Match'}

                </p>

                <p className="text-gray-500 text-sm mb-4">
                  AI-generated similarity score based on the available report information.
                </p>

                <MatchBar
                  label="Overall Match"
                  percent={score}
                />

              </div>

            </div>

          )}

          {/* =========================
              CONFIDENCE MESSAGE
          ========================= */}

          {bestMatch && score >= 70 && (

            <div className="relative mt-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">

              <ShieldCheck
                className="text-green-600 shrink-0"
                size={24}
              />

              <p className="text-sm text-green-700">

                <b>High confidence match!</b>{' '}
                Please review the details below and claim your item if it is yours.

              </p>

            </div>

          )}

        </div>

        {/* =========================
            YOUR ITEM + MATCH
        ========================= */}

        {item && bestMatch && (

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* YOUR ITEM */}

            <ItemCard
              tag="Your Report"
              tagColor="red"
              item={item}
            />

            {/* VS */}

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-[#FF6D29]/30 items-center justify-center shadow-sm">

              <span className="text-[#FF6D29] font-bold text-xs">
                VS
              </span>

            </div>

            {/* MATCHED ITEM */}

            <ItemCard
              tag="Matched Item"
              tagColor="green"
              item={bestMatch}
            />

          </div>

        )}

        {/* =========================
            OTHER MATCHES
        ========================= */}

        {matches.length > 1 && (

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Other Potential Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {matches.slice(1).map((match) => {

                const matchScore =
                  Number(match.score || 0)

                return (
                  <div
                    key={match.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                  >

                    <div className="flex justify-between items-center mb-3">

                      <span className="text-sm font-semibold text-gray-900">
                        {match.category}
                      </span>

                      <span className="text-sm font-bold text-[#FF6D29] whitespace-nowrap">
                        {matchScore.toFixed(2)}%
                      </span>

                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      <b>Location:</b>{' '}
                      {match.location}
                    </p>

                    <p className="text-sm text-gray-600 mb-3">
                      <b>Date:</b>{' '}
                      {formatDate(match.date_time)}
                    </p>

                    <MatchBar
                      label="Match Score"
                      percent={matchScore}
                    />

                  </div>
                )
              })}

            </div>

          </div>

        )}

        {/* =========================
            NOT YOUR ITEM
        ========================= */}

        {bestMatch && (

          <div className="bg-orange-50 border border-[#FF6D29]/20 rounded-xl px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">

            <p className="text-gray-600 text-sm">
              Not your item? No problem. You can continue searching or wait for a better match.
            </p>

            <button
              onClick={() =>
                alert(
                  "Thanks for the feedback! We've flagged this match for review."
                )
              }
              className="flex items-center gap-2 text-[#FF6D29] border border-[#FF6D29]/40 px-4 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-orange-100 transition-colors"
            >

              <Flag size={14} />

              Report Incorrect Match

            </button>

          </div>

        )}

        {/* =========================
            CLAIM
        ========================= */}

        {bestMatch && (

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>

              <p className="font-semibold text-gray-900">
                Ready to claim your item?
              </p>

              <p className="text-gray-500 text-sm">
                If you're sure this is your item, send a claim request to the finder.
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

              <button
                onClick={() => {
                  alert(
                    'Claim request sent! The finder will be notified.'
                  )

                  navigate('/')
                }}
                className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >

                <ShoppingBag size={16} />

                Claim This Item

              </button>

              <button
                onClick={() => navigate('/')}
                className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >

                <Search size={16} />

                Keep Searching

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}


// ========================================
// MATCH BAR
// ========================================

function MatchBar({ label, percent }) {

  const numericPercent = Number(percent || 0)

  return (
    <div className="mb-2 last:mb-0">

      <div className="flex justify-between text-xs text-gray-500 mb-1">

        <span>
          {label}
        </span>

        <span className="text-[#FF6D29] font-semibold whitespace-nowrap">
          {numericPercent.toFixed(2)}%
        </span>

      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">

        <div
          className="bg-[#FF6D29] h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(
              Math.max(numericPercent, 0),
              100
            )}%`,
          }}
        />

      </div>

    </div>
  )
}


// ========================================
// ITEM CARD
// ========================================

function ItemCard({
  tag,
  tagColor,
  item,
}) {

  const bg =
    tagColor === 'red'
      ? 'bg-red-50'
      : 'bg-green-50'

  const border =
    tagColor === 'red'
      ? 'border-red-100'
      : 'border-green-100'

  const tagBg =
    tagColor === 'red'
      ? 'bg-red-100 text-red-600'
      : 'bg-green-100 text-green-600'

  return (

    <div
      className={`${bg} border ${border} rounded-xl p-5`}
    >

      <span
        className={`${tagBg} text-xs font-semibold px-3 py-1 rounded-full`}
      >
        {tag}
      </span>

      {/* IMAGE */}

      <div className="bg-white border border-gray-100 h-40 rounded-lg my-4 overflow-hidden flex flex-col items-center justify-center">

        {item?.image_url ? (

          <img
            src={item.image_url}
            alt={item.category || 'Item'}
            className="w-full h-full object-contain"
          />

        ) : (

          <>
            <ImageIcon
              size={28}
              className="text-gray-300"
            />

            <span className="text-xs text-gray-400 mt-2">
              No Item Photo
            </span>
          </>

        )}

      </div>

      <p className="text-gray-400 text-xs mb-2">
        Reported on {formatDate(item?.date_time)}
      </p>

      <p className="text-sm text-gray-700">
        <b>Category:</b>{' '}
        {item?.category || 'N/A'}
      </p>

      <p className="text-sm text-gray-700">
        <b>Location:</b>{' '}
        {item?.location || 'N/A'}
      </p>

      <p className="text-sm text-gray-700">
        <b>Date & Time:</b>{' '}
        {formatDate(item?.date_time)}
      </p>

      <p className="text-sm text-gray-700 mt-1">
        <b>Description:</b>{' '}
        {item?.description || 'No description provided.'}
      </p>

    </div>

  )
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateTime) {

  if (!dateTime) {
    return 'N/A'
  }

  const date = new Date(
    dateTime.replace(' ', 'T')
  )

  if (Number.isNaN(date.getTime())) {
    return dateTime
  }

  return date.toLocaleString()
}


export default MatchResult