import { Toaster, toast } from "react-hot-toast";
import { Check, X } from "lucide-react";

const Spinner = ({ className = "", ...props }) => {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-white ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
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
  );
};

// Loading toast component
const LoadingToast = ({ t, message }) => {
  return (
    <div
      className={`max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-out ${
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <Spinner className="text-white" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom success toast component
const SuccessToast = ({ t, message }) => {
  return (
    <div
      className={`max-w-md w-full bg-[#ebf9eb] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-out ${
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Custom error toast component
const ErrorToast = ({ t, message }) => {
  return (
    <div
      className={`max-w-md w-full bg-red-50 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-out ${
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            <X className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Toast container configuration
export const ToastContainer = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: "transparent",
          padding: 0,
          boxShadow: "none",
          border: "none",
          maxWidth: "100%",
        },
      }}
    />
  );
};

// Custom toast functions
export const showLoadingToast = (message) => {
  return toast.custom((t) => <LoadingToast t={t} message={message} />, {
    duration: Infinity,
  });
};

export const showSuccessToast = (message, loadingToastId) => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
  }
  toast.custom((t) => <SuccessToast t={t} message={message} />);
};

export const showErrorToast = (message, loadingToastId) => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
  }
  toast.custom((t) => <ErrorToast t={t} message={message} />);
};
