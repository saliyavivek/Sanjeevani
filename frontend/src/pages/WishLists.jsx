import React, { useEffect, useState } from "react";
import WishlistCard from "../components/WishlistCard";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../components/toast";

const Wishlists = () => {
  const [userId, setUserId] = useState(null);
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchWishlists = async () => {
    console.log(userId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlists/get/${userId}`
      );
      if (!response.ok) {
        console.log("Couldn't fetch wishlists currently.");
        return;
      }
      const data = await response.json();
      console.log(data);

      setWishlists(data.wishlist);
    } catch (error) {
      console.log("Couldn't wishlist this warehouse currently.");
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, [userId]);

  const handleRemoveWishlist = async (wishlistId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlists/remove/${wishlistId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );
      if (!response.ok) {
        console.log("Couldn't remove warehouse from wishlist.");
        return;
      }
      const data = await response.json();
      showSuccessToast(data.message);
      setIsFavorite(false);
      fetchWishlists();
    } catch (error) {
      showErrorToast("Couldn't wishlist this warehouse currently.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold mb-8">Wishlists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist._id}
            wishlist={wishlist}
            onRemove={handleRemoveWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlists;
