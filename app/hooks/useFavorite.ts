import axios from "axios"; // Importa Axios para realizar solicitudes HTTP
import { useRouter } from "next/navigation"; // Importa el hook useRouter de Next.js para la navegación
import { useCallback, useMemo } from "react"; // Importa los hooks useCallback y useMemo de React para la optimización
import { toast } from "react-hot-toast"; // Importa el componente de tostadas de react-hot-toast para mostrar notificaciones

import { SafeUser } from "@/app/types"; // Importa el tipo SafeUser desde el archivo de tipos

import useLoginModal from "./useLoginModal"; // Importa el hook useLoginModal para gestionar el modal de inicio de sesión

// Interfaz para los parámetros del hook useFavorite
interface IUseFavorite {
  listingId: string; // ID del listado
  currentUser?: SafeUser | null; // Usuario actual
}

// Hook personalizado useFavorite para gestionar la funcionalidad de favoritos
const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter(); // Obtiene el objeto router para la navegación

  const loginModal = useLoginModal(); // Obtiene la función de apertura del modal de inicio de sesión desde el hook useLoginModal

  // Determina si el listado ha sido marcado como favorito por el usuario actual
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || []; // Obtiene la lista de IDs de favoritos del usuario actual

    return list.includes(listingId); // Devuelve true si el ID del listado está incluido en la lista de favoritos del usuario
  }, [currentUser, listingId]); // Dependencias para la memorización

  // Función para alternar el estado de favorito del listado
  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Detiene la propagación del evento para evitar comportamientos no deseados

    if (!currentUser) { // Si no hay un usuario actualmente autenticado
      return loginModal.onOpen(); // Abre el modal de inicio de sesión
    }

    try {
      let request; // Inicializa la solicitud de manera condicional según si el listado ya está marcado como favorito o no

      if (hasFavorited) { // Si el listado ya está marcado como favorito
        request = () => axios.delete(`/api/favorites/${listingId}`); // Solicitud para eliminar el listado de favoritos
      } else { // Si el listado no está marcado como favorito
        request = () => axios.post(`/api/favorites/${listingId}`); // Solicitud para añadir el listado a favoritos
      }

      await request(); // Realiza la solicitud
      router.refresh(); // Actualiza la página
      toast.success('Success'); // Muestra una notificación de éxito
    } catch (error) {
      toast.error('Something went wrong.'); // Muestra una notificación de error si ocurre un problema durante la solicitud
    }
  }, [currentUser, hasFavorited, listingId, loginModal, router]); // Dependencias para la memorización

  // Devuelve el estado de favorito y la función para alternar el estado de favorito
  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite; // Exporta el hook personalizado useFavorite por defecto

