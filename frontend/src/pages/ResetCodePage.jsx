import { useState, useEffect } from "react";
import {
  Copy,
  CheckCircle,
  ArrowRight,
  Shield,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

const ResetCodePage = () => {
  const [resetCode, setResetCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchUser = async () => {
    if (id) {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (response.ok) {
        const data = await response.json();

        setResetCode(data.resetToken);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    // Set expiration countdown (10 minutes)
    if (resetCode) {
      setCountdown(15 * 60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resetCode]);

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(resetCode)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleContinue = () => {
    setShowVerificationForm(true);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerificationError("");

    if (!enteredCode.trim()) {
      setVerificationError("Please enter the reset code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-reset-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          token: enteredCode,
        }),
      });

      if (response.ok) {
        window.location.href = `/reset-password?token=${resetCode}`;
      } else {
        const data = await response.json();
        setVerificationError(
          data.message || "Invalid reset code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setVerificationError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToCode = () => {
    setShowVerificationForm(false);
    setEnteredCode("");
    setVerificationError("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {!showVerificationForm ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Reset Code
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We've generated a unique reset code for you. Use this code to
                  reset your password.
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div
                    className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={handleCopyCode}
                  >
                    <span className="text-md font-mono tracking-wider text-gray-800">
                      {resetCode?.length > 18
                        ? `${resetCode.substring(0, 18)}...`
                        : resetCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Copy reset code"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Code copied to clipboard!</span>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500 text-center">
                  This code will expire in{" "}
                  <span className="font-medium">{formatTime(countdown)}</span>
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleContinue}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Continue to Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Verify Reset Code
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please enter the reset code you received to continue with the
                  password reset process.
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="mt-6">
                <div>
                  <label
                    htmlFor="reset-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reset Code
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="reset-code"
                      name="reset-code"
                      type="text"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your reset code"
                      autoComplete="off"
                    />
                  </div>
                  {verificationError && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{verificationError}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
                  <button
                    type="button"
                    onClick={handleBackToCode}
                    className="mb-3 sm:mb-0 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="mb-3 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetCodePage;
