import { Link, useLocation } from 'react-router-dom'
import {
  CheckCircle2,
  Search,
  Home as HomeIcon
} from 'lucide-react'

function ReportSubmitted() {

  const location = useLocation()

  const type = location.state?.type

  const itemId =
    location.state?.itemId ||
    localStorage.getItem("lastReportId")

  const content = {

    lost: {
      title: "Thanks for reporting your lost item!",
      message:
        "We've noted down everything you shared. Our AI will compare your report against found item reports.",
    },

    found: {
      title: "Thanks for helping reunite this item!",
      message:
        "Your report has been added to our system. We'll compare it against lost item reports to find a possible owner.",
    },

    default: {
      title: "Thanks for submitting your report!",
      message:
        "Our AI is comparing your item with existing reports.",
    },

  }

  const currentContent =
    content[type] || content.default

  return (

    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 font-['Neue_Montreal',_sans-serif]">

      <div className="max-w-md w-full text-center">

        {/* Success Icon */}

        <div className="w-20 h-20 rounded-full bg-orange-50 border border-[#FF6D29]/30 flex items-center justify-center mx-auto mb-6">

          <CheckCircle2
            className="text-[#FF6D29]"
            size={40}
          />

        </div>

        {/* Title */}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">

          {currentContent.title}

        </h1>

        {/* Message */}

        <p className="text-gray-500 mb-8">

          {currentContent.message}

        </p>

        {/* Info */}

        <div className="bg-orange-50 border border-[#FF6D29]/20 rounded-xl p-5 mb-8 text-left">

          <p className="text-sm text-gray-700">

            <span className="font-semibold text-gray-900">
              Next step:
            </span>{" "}

            Click Check Status to see whether our AI has found a potential match.

          </p>

        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-3">

          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <HomeIcon size={18} />
            Back to Home
          </Link>

          <Link
            to="/match-result"
            state={{ itemId }}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6D29] text-white py-3 rounded-lg font-semibold hover:bg-[#e85f20] transition-colors"
          >
            <Search size={18} />
            Check Status
          </Link>

        </div>

      </div>

    </div>

  )
}

export default ReportSubmitted