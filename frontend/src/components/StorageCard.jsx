import { useNavigate } from "react-router-dom";

const StorageCard = ({ warehouse }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/warehouse/${warehouse._id}`, { state: { warehouse } });
  };

  return (
    <div className="group flex flex-col" onClick={handleClick}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <img
          src={warehouse.images[0]}
          alt={warehouse.name}
          fill
          className="object-cover transition-transform group-hover:scale-105 h-80"
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900">
        {warehouse.name}
      </h3>
      <p className="text-sm text-gray-600">
        Listed by {warehouse.ownerId.name}
      </p>
      <p
        className={`mt-1 text-sm ${
          warehouse.availability === "available"
            ? "text-green-600"
            : warehouse.availability === "booked"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {warehouse.availability === "available"
          ? "Available"
          : warehouse.availability === "booked"
          ? "Sold Out"
          : "Under Maintenance"}
      </p>
    </div>
  );
};

export default StorageCard;
