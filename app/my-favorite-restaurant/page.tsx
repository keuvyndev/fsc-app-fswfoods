import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";

const myFavoriteRestaurants = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
    },
  });

  const serializedOrders = JSON.parse(
    JSON.stringify(userFavoriteRestaurants),
  ) as typeof userFavoriteRestaurants;

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>
        <div className="flex w-full flex-col gap-6">
          {serializedOrders.length > 0 ? (
            serializedOrders.map(({ restaurant }) => (
              <RestaurantItem
                key={restaurant.id}
                restaurant={JSON.parse(JSON.stringify(restaurant))}
                className="min-w-full max-w-full"
                userFavoriteRestaurants={serializedOrders}
              />
            ))
          ) : (
            <h3 className="font-medium">
              Você ainda não marcou nenhum restaurante como favorito.
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default myFavoriteRestaurants;
