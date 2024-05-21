'use client'; // Indica el tipo de entorno, en este caso, cliente

// Importaciones de librerías y componentes
import axios from "axios"; // Importa la librería Axios para realizar solicitudes HTTP
import { useCallback, useEffect, useMemo, useState } from "react"; // Importa funciones y tipos de React
import { toast } from "react-hot-toast"; // Importa la librería react-hot-toast para notificaciones
import { Range } from "react-date-range"; // Importa el componente Range de react-date-range
import { useRouter } from "next/navigation"; // Importa el hook useRouter de next/navigation para acceder al enrutador de Next.js
import { differenceInDays, eachDayOfInterval } from 'date-fns'; // Importa funciones de date-fns para manipulación de fechas

import useLoginModal from "@/app/hooks/useLoginModal"; // Importa un hook personalizado para el modal de inicio de sesión
import { SafeListing, SafeUser, SafeReservation } from "@/app/types"; // Importa tipos de datos seguros

import Container from "@/app/components/Container"; // Importa el componente Container
import { categories } from "@/app/components/navbar/Categories"; // Importa la lista de categorías desde un archivo local
import ListingHead from "@/app/components/listings/ListingHead"; // Importa el componente ListingHead
import ListingInfo from "@/app/components/listings/ListingInfo"; // Importa el componente ListingInfo
import ListingReservation from "@/app/components/listings/ListingReservation"; // Importa el componente ListingReservation

const initialDateRange = { // Define el rango de fecha inicial
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

// Props del componente ListingClient
interface ListingClientProps {
  reservations?: SafeReservation[]; // Lista de reservaciones (opcional)
  listing: SafeListing & { // Detalles del listado seguro con el usuario
    user: SafeUser; // Usuario propietario del listado
  };
  currentUser?: SafeUser | null; // Usuario actual (opcional)
}

// Componente funcional ListingClient
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser
}) => {
  const loginModal = useLoginModal(); // Hook personalizado para el modal de inicio de sesión
  const router = useRouter(); // Hook useRouter para acceder al enrutador de Next.js

  // Calcula las fechas deshabilitadas basadas en las reservaciones existentes
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  // Encuentra la categoría del listado actual
  const category = useMemo(() => {
     return categories.find((items) => 
      items.label === listing.category);
  }, [listing.category]);

  // Estados del componente
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está cargando
  const [totalPrice, setTotalPrice] = useState(listing.price); // Estado para el precio total
  const [dateRange, setDateRange] = useState<Range>(initialDateRange); // Estado para el rango de fechas seleccionado

  // Función para crear una reserva
  const onCreateReservation = useCallback(() => {
      if (!currentUser) { // Si no hay usuario actual, abre el modal de inicio de sesión
        return loginModal.onOpen();
      }
      setIsLoading(true); // Indica que se está cargando

      // Realiza una solicitud POST para crear una reserva
      axios.post('/api/reservations', {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id
      })
      .then(() => { // Si la solicitud es exitosa, muestra una notificación y redirige al usuario
        toast.success('Evento reservado!');
        setDateRange(initialDateRange); // Restablece el rango de fechas
        router.push('/trips'); // Redirige a la página de viajes
      })
      .catch(() => { // Si hay un error en la solicitud, muestra una notificación de error
        toast.error('Something went wrong.');
      })
      .finally(() => { // Después de que la solicitud termine (éxito o error), indica que la carga ha terminado
        setIsLoading(false);
      })
  },
  [
    totalPrice, 
    dateRange, 
    listing?.id,
    router,
    currentUser,
    loginModal
  ]);

  // Efecto secundario para calcular el precio total basado en el rango de fechas seleccionado
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(
        dateRange.endDate, 
        dateRange.startDate
      );
      
      if (dayCount && listing.price) { // Si hay un número válido de días y un precio de listado válido
        setTotalPrice(dayCount * listing.price); // Calcula el precio total
      } else {
        setTotalPrice(listing.price); // Utiliza el precio base del listado
      }
    }
  }, [dateRange, listing.price]);

  // Renderiza el componente
  return ( 
    <Container> {/* Contenedor principal */}
      <div 
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6"> {/* Contenedor de elementos */}
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          /> {/* Cabecera del listado */}
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          > {/* Contenedor de información del listado y formulario de reserva */}
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            /> {/* Información detallada del listado */}
            <div 
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            > {/* Formulario de reserva */}
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
   );
}
 
export default ListingClient; // Exporta el componente ListingClient por defecto
