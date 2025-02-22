import { CornerDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ReviewReply = ({ reply }) => {
  return (
    <div className="ml-12 mt-4 relative">
      {/* Vertical connection line */}
      <div className="absolute -left-6 top-0 bottom-0 w-[2px]"></div>

      {/* Reply container */}
      <div className="relative">
        {/* Horizontal connection line with icon */}
        <div className="absolute -left-6 top-6 w-4 h-[2px]"></div>
        <CornerDownRight className="absolute -left-10 top-4 w-4 h-4 text-gray-400" />

        {/* Reply content */}
        <div className="rounded-lg p-4">
          {/* Owner info */}
          <div className="flex items-center mb-3">
            <div className="relative">
              <a href={`/users/o/show/${reply.ownerId}`}>
                {reply.ownerId.avatar ? (
                  <img
                    src={reply.ownerId.avatar || "/placeholder.svg"}
                    alt={`${reply.ownerId.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-base font-semibold">
                    {reply.ownerId.name.charAt(0)}
                  </div>
                )}
              </a>
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h4 className="font-semibold text-gray-900">
                  {reply.ownerId.name}
                </h4>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Owner
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Reply text */}
          <div className="text-base text-gray-700">
            <p>{reply.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReply;
