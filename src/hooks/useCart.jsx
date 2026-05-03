import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useCart = () => {
  const { user } = useAuth();

  const { data: cart = [], refetch } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`http://localhost:8000/carts?email=${user.email}`);
      const data = await res.json();
      return data;
    },
    enabled: !!user?.email // only fetch if user is logged in
  });

  const clearCart = async () => {
    if (!user?.email) return;
    try {
      await fetch(`http://localhost:8000/carts/clear?email=${user.email}`, {
        method: 'DELETE'
      });
      refetch();
    } catch (err) {
      console.log('Error clearing cart:', err);
    }
  };

  return [cart, refetch, clearCart];
};

export default useCart;
