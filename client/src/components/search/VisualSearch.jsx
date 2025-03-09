import React, { useState, useRef, useEffect } from "react";

const VisualSearchButton = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const wrapperRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
        closeCamera();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Camera handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Camera access denied. Please enable camera permissions.");
    }
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCameraError("");
  };

  // Image handling
  const handleImageUpload = (e) => {
    console.log(e.target.files)
    const file = e.target.files?.[0];
    console.log("yah")
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    } else {
      alert("Please select an image!");
    }
  };

  const proceedToResults = async () => {
    if (!uploadedImage || !fileInputRef.current?.files[0]) {
      alert("Please upload an image first!");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Starting request process..."); // Debug log

      const formData = new FormData();
      formData.append('image', fileInputRef.current.files[0]);
      console.log("FormData created:", fileInputRef.current.files[0].name); // Debug log
      
      const response = await fetch('http://127.0.0.1:3000/imagesearch', {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': '/'
        }
      });

      console.log("Response received:", response.status); // Debug log

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText); // Debug log
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      console.log("Response data:", data); // Debug log
      
      if (data.keywords) {
        console.log("Keywords found:", data.keywords); // Debug log
        const searchQuery = data.keywords.join(' ');
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      } else {
        console.log("No keywords in response"); // Debug log
        alert('No keywords found in the image');
      }
    } catch (error) {
      console.error('Detailed error:', error); // Enhanced error logging
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL("image/png");
      setCapturedImage(imageData);
      closeCamera();
    }
  };

  // UI interactions
  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600"
        aria-label="Visual search"
        onClick={handleDropdownClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md">
          <button
            onClick={() => {
              setShowCamera(true);
              startCamera();
              setDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Use Camera
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click()}}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            // type="button"
          >
            Upload Image
          </button>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl p-6 relative">
            <h3 className="text-lg font-semibold mb-2 text-center">Capture Photo</h3>
            <video ref={videoRef} className="w-full rounded-lg shadow-lg mb-4" autoPlay muted />
            <div className="flex justify-center gap-4">
              <button
                onClick={capturePhoto}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {uploadedImage && (
        <div className="mt-4">
          <h3 className="text-center mb-2 text-gray-600">Uploaded Image:</h3>
          <img
            src={uploadedImage}
            alt="Uploaded Preview"
            className="max-w-full h-auto rounded-md shadow-md mx-auto mb-4"
          />
          <button
            onClick={proceedToResults}
            disabled={isProcessing}
            className={`block mx-auto ${
              isProcessing ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded-md transition`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Proceed to Results'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualSearchButton;