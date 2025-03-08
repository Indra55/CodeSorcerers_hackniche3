import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MicrophoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const SearchWithSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += text + " ";
        } else {
          interimTranscript += text;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening]);

  const handleSpeechButton = () => {
    setIsListening((prev) => !prev);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsListening(false);
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Box */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Search here..."
          className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSpeechButton}
          className={`p-2 rounded-r-lg transition ${
            isListening ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          <MicrophoneIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Modal for Transcript */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {isListening ? "Listening..." : "Speech Transcript"}
                    </Dialog.Title>
                    <button onClick={closeModal}>
                      <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg h-40 overflow-y-auto">
                    <motion.p
                      className="text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {transcript || "Start speaking to see the transcript..."}
                    </motion.p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SearchWithSpeech;
