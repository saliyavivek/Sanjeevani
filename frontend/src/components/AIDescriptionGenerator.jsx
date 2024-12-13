import React, { useState } from "react";
import { Wand2 } from "lucide-react";

const AIDescriptionGenerator = ({
  name,
  size,
  location,
  onDescriptionGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/warehouses/generate-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, size, location }),
        }
      );
      const data = await response.json();
      onDescriptionGenerated(data.description);
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateDescription}
      disabled={isGenerating}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
    >
      {isGenerating ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? "Generating..." : "Generate Description"}
    </button>
  );
};

export default AIDescriptionGenerator;
