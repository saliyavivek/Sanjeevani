import React, { useState } from "react";
import {
  X,
  Copy,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Code,
  MoreHorizontal,
} from "lucide-react";

const ShareModal = ({ isOpen, onClose, listing }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions = [
    {
      icon: <Copy className="w-5 h-5" />,
      label: "Copy Link",
      onClick: handleCopyLink,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      onClick: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(
          listing.name
        )}&body=${encodeURIComponent(window.location.href)}`),
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
      onClick: () =>
        (window.location.href = `sms:?&body=${encodeURIComponent(
          window.location.href
        )}`),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M20.744 3.256C20.312 2.824 19.313 2 18.048 2H5.952C4.687 2 3.688 2.828 3.256 3.256C2.828 3.688 2 4.687 2 5.952v12.096c0 1.265.824 2.264 1.256 2.696.432.432 1.431 1.256 2.696 1.256h12.096c1.265 0 2.264-.82 2.696-1.256.432-.432 1.256-1.431 1.256-2.696V5.952c0-1.265-.824-2.264-1.256-2.696zM8.25 18.75v-4.875H6v-3h2.25V9.75c0-2.203 1.485-3.375 3.375-3.375 1.005 0 1.94.075 2.25.11v2.565h-1.5c-1.207 0-1.5.57-1.5 1.402v1.823h3l-.375 3h-2.625v4.875h-2.625z" />
        </svg>
      ),
      label: "Facebook",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`
        ),
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      label: "Twitter",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            window.location.href
          )}&text=${encodeURIComponent(listing.name)}`
        ),
    },
    {
      icon: (
        // <svg >
        //   <path d="M20.744 3.256C20.312 2.824 19.313 2 18.048 2H5.952C4.687 2 3.688 2.828 3.256 3.256C2.828 3.688 2 4.687 2 5.952v12.096c0 1.265.824 2.264 1.256 2.696.432.432 1.431 1.256 2.696 1.256h12.096c1.265 0 2.264-.82 2.696-1.256.432-.432 1.256-1.431 1.256-2.696V5.952c0-1.265-.824-2.264-1.256-2.696zM17.25 8.25c-.75 0-1.35.6-1.35 1.35s.6 1.35 1.35 1.35 1.35-.6 1.35-1.35-.6-1.35-1.35-1.35zM12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        // </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          aria-hidden="true"
          role="presentation"
          focusable="false"
          style={{
            display: "block",
            height: "20px",
            width: "20px",
            fill: "currentColor",
          }}
        >
          <path d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path>
          <path
            fill="#fff"
            d="m4 28 1.7-6.16a11.82 11.82 0 0 1-1.6-5.95 11.94 11.94 0 0 1 20.4-8.4A11.8 11.8 0 0 1 28 15.9a11.94 11.94 0 0 1-17.67 10.45zm6.63-3.8a9.93 9.93 0 0 0 15.35-8.3A9.9 9.9 0 0 0 16.05 6a9.92 9.92 0 0 0-9.93 9.9c0 2.22.65 3.88 1.75 5.63l-1 3.64 3.76-.98zm11.36-5.52c-.07-.13-.27-.2-.57-.35-.3-.15-1.75-.86-2.03-.96-.27-.1-.46-.15-.66.15s-.77.96-.94 1.16-.35.22-.65.07c-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.04s-.02-.46.13-.6l.44-.52c.15-.17.2-.3.3-.5.1-.2.05-.36-.02-.51-.08-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.66-.5l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.2 3.06c.16.2 2.1 3.18 5.08 4.46.7.3 1.26.48 1.69.62.7.22 1.36.19 1.87.11.57-.08 1.75-.71 2-1.4s.25-1.28.17-1.4z"
          ></path>
        </svg>
      ),
      label: "WhatsApp",
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            listing.name + "\n" + window.location.href
          )}`
        ),
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: "Embed",
      onClick: () => {
        /* Add embed functionality */
      },
    },
    {
      icon: <MoreHorizontal className="w-5 h-5" />,
      label: "More options",
      onClick: () => {
        /* Add more options functionality */
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Share this place</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Listing Preview */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={listing.images[0]}
              alt={listing.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium">{listing.name}</h3>
              <p className="text-sm text-gray-600">by {listing.ownerId.name}</p>
            </div>
          </div>

          {/* Share Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left w-full"
              >
                <span className="text-gray-600">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Copy Feedback */}
          {copied && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm">
              Link copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
