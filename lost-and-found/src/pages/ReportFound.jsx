import { useState } from 'react'
import {
  Tag,
  MapPin,
  User,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Sun,
  Focus,
  Camera,
  LayoutGrid,
  Send,
  HelpCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5000'

function ReportFound() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // ==========================================
  // PHOTO HANDLING
  // ==========================================

  const handlePhotoChange = (e) => {
    const newFiles = Array.from(e.target.files)

    setPhotos((prevPhotos) =>
      [...prevPhotos, ...newFiles].slice(0, 5)
    )

    // Allow selecting the same file again
    e.target.value = ""
  }

  const removePhoto = (index) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, i) => i !== index)
    )
  }

  // ==========================================
  // STEP 1 -> STEP 2
  // ==========================================

  const goToPhoto = () => {
    if (
      !category ||
      !description ||
      !location ||
      !date ||
      !time ||
      !name ||
      !phone
    ) {
      setError(
        "Please fill all required fields marked with * before continuing."
      )
      return
    }

    setError("")
    setStep(2)
  }

  // ==========================================
  // SUBMIT REPORT TO FLASK BACKEND
  // ==========================================

  const handleSubmit = async () => {
    if (submitting) return

    try {
      setSubmitting(true)
      setError("")

      // Create FormData
      const formData = new FormData()

      // Required fields
      formData.append("type", "found")
      formData.append("category", category)
      formData.append("description", description)
      formData.append("location", location)
      formData.append("date", date)
      formData.append("time", time)

      // Optional field
      formData.append(
        "additional_details",
        additionalDetails
      )

      // Contact information
      formData.append("name", name)
      formData.append("phone", phone)

      // Add uploaded photos
      // Backend currently uses the first image for AI matching.
      photos.forEach((photo) => {
        formData.append("image", photo)
      })

      console.log("Submitting found item report...")

      // ==========================================
      // SEND TO FLASK
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/report`,
        {
          method: "POST",
          body: formData
        }
      )

      // Try to read JSON response
      let data

      try {
        data = await response.json()
      } catch {
        throw new Error(
          "Invalid response received from the server."
        )
      }

      console.log("Backend response:", data)

      // ==========================================
      // HANDLE ERROR
      // ==========================================

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to submit the report."
        )
      }

      // ==========================================
      // SAVE REPORT ID
      // ==========================================

      localStorage.setItem(
        "lastReportId",
        String(data.item_id)
      )

      // Also save complete report information
      localStorage.setItem(
        "lastReport",
        JSON.stringify({
          item_id: data.item_id,
          type: "found",
          matches: data.matches || []
        })
      )

      console.log(
        "Report submitted successfully."
      )

      console.log(
        "Report ID:",
        data.item_id
      )

      console.log(
        "Matches:",
        data.matches || []
      )

      // ==========================================
      // GO TO REPORT SUBMITTED PAGE
      // ==========================================

      navigate(
        "/report-submitted",
        {
          state: {
            type: "found",
            itemId: data.item_id,
            matches: data.matches || []
          }
        }
      )

    } catch (err) {
      console.error(
        "Report submission error:",
        err
      )

      setError(
        err.message ||
        "Unable to submit report. Please check that the backend is running."
      )

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4 md:px-6">

      <div className="max-w-5xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">

          <div className="flex items-start gap-4">

            <Link
              to="/"
              className="bg-green-100 text-green-600 p-2 rounded-lg"
            >
              ←
            </Link>

            <div>

              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Report Found Item
              </h1>

              <p className="text-gray-400 text-sm">

                {step === 1 &&
                  "Help us reunite this item with its owner."}

                {step === 2 &&
                  "Upload clear photos to help our AI match this item faster."}

                {step === 3 &&
                  "Please review your details before submitting."}

              </p>

            </div>

          </div>

          <div className="bg-green-50 border border-green-100 text-green-600 text-xs px-4 py-2 rounded-lg w-full md:max-w-xs">

            🛡{" "}

            {step === 3
              ? "Your information is safe and used only for verification."
              : "Please keep the item safe until we help reunite it."}

          </div>

        </div>

        {/* ==========================================
            STEP INDICATOR
        ========================================== */}

        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 mb-8 text-sm">

          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
              step === 1
                ? "bg-green-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {step > 1 ? "✓" : "1"}
          </span>

          <span className="text-gray-600">
            Details
          </span>

          <span className="w-6 md:w-16 h-px bg-gray-300"></span>

          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
              step === 2 || step > 2
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > 2 ? "✓" : "2"}
          </span>

          <span className="text-gray-600">
            Photo
          </span>

          <span className="w-6 md:w-16 h-px bg-gray-300"></span>

          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
              step === 3
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </span>

          <span className="text-gray-600">
            Review
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ==========================================
              MAIN CARD
          ========================================== */}

          <div className="md:col-span-2 bg-white p-5 md:p-8 rounded-xl shadow-sm">

            {/* ==========================================
                STEP 1 - DETAILS
            ========================================== */}

            {step === 1 && (
              <div>

                <h2 className="font-bold text-gray-800 mb-4">
                  Item Details
                </h2>

                {/* Category */}

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="wallet">
                    Wallet
                  </option>

                  <option value="bottle">
                    Water Bottle
                  </option>

                  <option value="id">
                    ID Card
                  </option>

                  <option value="earphones">
                    Earphones
                  </option>

                  <option value="keys">
                    Keys
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

                {/* Description */}

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the item in detail (color, brand, size, unique marks, etc.)"
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-1 h-24"
                />

                <p className="text-gray-400 text-xs text-right mb-4">
                  {description.length}/500
                </p>

                {/* Location */}

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Found{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Where did you find the item?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-1"
                />

                <p className="text-green-600 text-xs mb-4">
                  Be as specific as possible
                  (e.g., Library, Second Floor)
                </p>

                {/* Date + Time */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="time"
                      value={time}
                      onChange={(e) =>
                        setTime(e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />

                  </div>

                </div>

                {/* Additional Details */}

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details (Optional)
                </label>

                <textarea
                  value={additionalDetails}
                  onChange={(e) =>
                    setAdditionalDetails(e.target.value)
                  }
                  placeholder="Any other information that might help (e.g., where exactly, condition, etc.)"
                  maxLength={300}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-1 h-20"
                />

                <p className="text-gray-400 text-xs text-right mb-4">
                  {additionalDetails.length}/300
                </p>

                {/* Contact Information */}

                <div className="bg-green-50 p-4 rounded-lg mb-4">

                  <h3 className="font-semibold text-gray-700 mb-3">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your name"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        placeholder="Enter your phone number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />

                    </div>

                  </div>

                </div>

                {error && (
                  <p className="text-red-500 text-sm mb-4">
                    ⚠ {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={goToPhoto}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                >
                  Continue to Photo →
                </button>

              </div>
            )}

            {/* ==========================================
                STEP 2 - PHOTO
            ========================================== */}

            {step === 2 && (
              <div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">

                  <div className="flex gap-3">

                    <div className="bg-green-100 p-3 rounded-full h-fit">

                      <Camera
                        className="text-green-600"
                        size={20}
                      />

                    </div>

                    <div>

                      <h2 className="font-bold text-gray-800">
                        Upload Item Photo
                      </h2>

                      <p className="text-gray-400 text-sm">
                        Upload clear photos of the item from different angles for better matches.
                      </p>

                    </div>

                  </div>

                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                    Step 2 of 3
                  </span>

                </div>

                {/* Upload */}

                <label className="w-full border-2 border-dashed border-green-300 rounded-lg flex flex-col items-center justify-center gap-2 py-10 md:py-12 mb-6 cursor-pointer hover:bg-green-50 text-center px-2">

                  <UploadCloud
                    className="text-green-500"
                    size={36}
                  />

                  <span className="font-semibold text-gray-700">
                    Drag and drop your images here
                  </span>

                  <span className="text-gray-400 text-sm">
                    or
                  </span>

                  <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <UploadCloud size={16} />
                    Choose Files
                  </span>

                  <span className="text-gray-400 text-xs">
                    JPG, PNG up to 10MB each
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </label>

                {/* Tips */}

                <p className="font-semibold text-gray-700 mb-3">
                  Tips for better photos
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-center">

                  <div className="flex flex-col items-center gap-1">

                    <div className="bg-green-100 p-2 rounded-lg">
                      <Sun
                        className="text-green-500"
                        size={18}
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-700">
                      Good Lighting
                    </p>

                    <p className="text-xs text-gray-400">
                      Use natural light
                    </p>

                  </div>

                  <div className="flex flex-col items-center gap-1">

                    <div className="bg-green-100 p-2 rounded-lg">
                      <Focus
                        className="text-green-500"
                        size={18}
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-700">
                      Multiple Angles
                    </p>

                    <p className="text-xs text-gray-400">
                      Front, back, sides
                    </p>

                  </div>

                  <div className="flex flex-col items-center gap-1">

                    <div className="bg-green-100 p-2 rounded-lg">
                      <Camera
                        className="text-green-500"
                        size={18}
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-700">
                      Clear & Focused
                    </p>

                    <p className="text-xs text-gray-400">
                      Item clearly visible
                    </p>

                  </div>

                  <div className="flex flex-col items-center gap-1">

                    <div className="bg-green-100 p-2 rounded-lg">
                      <LayoutGrid
                        className="text-green-500"
                        size={18}
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-700">
                      Simple Background
                    </p>

                    <p className="text-xs text-gray-400">
                      Avoid clutter
                    </p>

                  </div>

                </div>

                {/* Uploaded photos */}

                <p className="font-semibold text-gray-700 mb-2">
                  Uploaded Photos ({photos.length}/5)
                </p>

                {photos.length === 0 ? (

                  <div className="bg-gray-50 rounded-lg py-8 text-center mb-6">

                    <p className="text-gray-500 font-medium">
                      No photos uploaded yet
                    </p>

                    <p className="text-gray-400 text-sm">
                      Upload up to 5 clear photos for the best results.
                    </p>

                  </div>

                ) : (

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">

                    {photos.map((file, i) => (

                      <div
                        key={`${file.name}-${i}`}
                        className="relative"
                      >

                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                        >
                          ✕
                        </button>

                      </div>

                    ))}

                  </div>

                )}

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-1/2 border border-green-300 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50"
                  >
                    ← Back to Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                  >
                    Continue to Review →
                  </button>

                </div>

              </div>
            )}

            {/* ==========================================
                STEP 3 - REVIEW
            ========================================== */}

            {step === 3 && (
              <div>

                <h2 className="font-bold text-gray-800 mb-1">
                  Review Your Report
                </h2>

                <p className="text-gray-400 text-sm mb-4">
                  Please check your details before submitting.
                </p>

                {/* Item Details */}

                <div className="border border-gray-200 rounded-lg p-4 mb-4">

                  <div className="flex justify-between items-center mb-2">

                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">

                      <Tag
                        size={16}
                        className="text-green-500"
                      />

                      Item Details

                    </h3>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-green-600 text-xs border border-green-300 px-3 py-1 rounded-lg"
                    >
                      ✎ Edit
                    </button>

                  </div>

                  <p className="text-sm text-gray-600">
                    <b>Category:</b> {category || "—"}
                  </p>

                  <p className="text-sm text-gray-600">
                    <b>Description:</b> {description || "—"}
                  </p>

                  <p className="text-sm text-gray-600">
                    <b>Additional Details:</b>{" "}
                    {additionalDetails || "—"}
                  </p>

                </div>

                {/* Location and Time */}

                <div className="border border-gray-200 rounded-lg p-4 mb-4">

                  <div className="flex justify-between items-center mb-2">

                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">

                      <MapPin
                        size={16}
                        className="text-green-500"
                      />

                      Location & Time

                    </h3>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-green-600 text-xs border border-green-300 px-3 py-1 rounded-lg"
                    >
                      ✎ Edit
                    </button>

                  </div>

                  <p className="text-sm text-gray-600">
                    <b>Location:</b> {location || "—"}
                  </p>

                  <p className="text-sm text-gray-600">

                    <b>Date:</b>{" "}
                    {date || "—"}

                    <b className="ml-4">
                      Time:
                    </b>{" "}
                    {time || "—"}

                  </p>

                </div>

                {/* Contact */}

                <div className="border border-gray-200 rounded-lg p-4 mb-4">

                  <div className="flex justify-between items-center mb-2">

                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">

                      <User
                        size={16}
                        className="text-green-500"
                      />

                      Your Contact Information

                    </h3>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-green-600 text-xs border border-green-300 px-3 py-1 rounded-lg"
                    >
                      ✎ Edit
                    </button>

                  </div>

                  <p className="text-sm text-gray-600">
                    <b>Name:</b> {name || "—"}
                  </p>

                  <p className="text-sm text-gray-600">
                    <b>Phone:</b> {phone || "—"}
                  </p>

                </div>

                {/* Photos */}

                <div className="border border-gray-200 rounded-lg p-4 mb-4">

                  <div className="flex justify-between items-center mb-2">

                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">

                      <ImageIcon
                        size={16}
                        className="text-green-500"
                      />

                      Item Photos ({photos.length})

                    </h3>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-green-600 text-xs border border-green-300 px-3 py-1 rounded-lg"
                    >
                      ✎ Edit
                    </button>

                  </div>

                  {photos.length === 0 ? (

                    <p className="text-sm text-gray-400">
                      No photos uploaded.
                    </p>

                  ) : (

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">

                      {photos.map((file, i) => (

                        <img
                          key={`${file.name}-${i}`}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-16 object-cover rounded-lg"
                        />

                      ))}

                    </div>

                  )}

                </div>

                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">

                  ℹ You can go back to edit any section if something is incorrect.

                </div>

                {/* Error */}

                {error && (

                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    ⚠ {error}
                  </div>

                )}

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                    className="w-full sm:w-1/2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
                  >
                    ← Back to Photos
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full sm:w-1/2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >

                    {submitting ? (
                      <>
                        <span className="animate-spin">
                          ⟳
                        </span>

                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Report
                      </>
                    )}

                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ==========================================
              RIGHT SIDEBAR
          ========================================== */}

          <div className="flex flex-col gap-4">

            {step === 1 && (

              <div className="bg-green-50 p-6 rounded-xl">

                <h3 className="font-semibold text-gray-800 mb-4">
                  💡 Tips for better matches
                </h3>

                <ul className="text-sm text-gray-600 space-y-3">

                  <li>
                    <b className="text-gray-700">
                      Be Specific
                    </b>

                    <br />

                    More details = higher chance of finding the owner.
                  </li>

                  <li>
                    <b className="text-gray-700">
                      Correct Location
                    </b>

                    <br />

                    Mention exact place and landmark.
                  </li>

                  <li>
                    <b className="text-gray-700">
                      Exact Time
                    </b>

                    <br />

                    Try to provide the exact date and time.
                  </li>

                  <li>
                    <b className="text-gray-700">
                      Clear Photo
                    </b>

                    <br />

                    A clear photo helps our AI match better.
                  </li>

                </ul>

              </div>

            )}

            {step === 2 && (

              <div className="bg-green-50 p-6 rounded-xl">

                <h3 className="font-semibold text-gray-800 mb-4">
                  💡 Photo Guidelines
                </h3>

                <ul className="text-sm text-gray-600 space-y-2">

                  <li className="flex gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    Use clear and high-quality images
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    Take photos from different angles
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    Show unique marks or features
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    Avoid blurry or dark photos
                  </li>

                  <li className="flex gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    Remove personal information from items
                  </li>

                </ul>

              </div>

            )}

            {step === 3 && (

              <div className="bg-green-50 p-6 rounded-xl">

                <h3 className="font-semibold text-gray-800 mb-4">
                  ✓ Submission Summary
                </h3>

                <div className="text-sm text-gray-600 space-y-3">

                  <p>
                    <span className="text-gray-400 block text-xs">
                      Category
                    </span>

                    <b>
                      {category || "—"}
                    </b>
                  </p>

                  <p>
                    <span className="text-gray-400 block text-xs">
                      Location
                    </span>

                    <b>
                      {location || "—"}
                    </b>
                  </p>

                  <p>
                    <span className="text-gray-400 block text-xs">
                      Date & Time
                    </span>

                    <b>
                      {date || "—"}, {time || "—"}
                    </b>
                  </p>

                  <p>
                    <span className="text-gray-400 block text-xs">
                      Photos
                    </span>

                    <b>
                      {photos.length} photo(s) uploaded
                    </b>
                  </p>

                </div>

              </div>

            )}

            {/* Need Help */}

            <div className="bg-green-50 p-6 rounded-xl">

              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">

                <HelpCircle
                  size={18}
                  className="text-green-600"
                />

                Need Help?

              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Contact our support team anytime.
              </p>

              <button
                type="button"
                className="w-full border border-green-300 text-green-600 py-2 rounded-lg text-sm font-semibold hover:bg-green-100"
              >
                Contact Support ↗
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ReportFound