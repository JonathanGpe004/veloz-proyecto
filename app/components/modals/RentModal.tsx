'use client'; 

import useRentModal from '@/app/hooks/useRentModal'; // Importa un hook personalizado para el modal de alquiler
import Modal from "./Modal"; // Importa el componente Modal
import { useMemo, useState } from 'react'; // Importa funciones de React
import Heading from '../Heading'; // Importa el componente Heading
import { categories } from '../navbar/Categories'; // Importa la lista de categorías desde un archivo local
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'; // Importa funciones y tipos relacionados con react-hook-form
import CategoryInput from '../inputs/CategoryInput'; // Importa el componente de entrada de categoría
import CountrySelect from '../inputs/CountrySelect'; // Importa el componente de selección de país
import dynamic from 'next/dynamic'; // Importa la función dynamic de next/dynamic para la carga dinámica de componente
import Counter from '../inputs/Counter'; // Importa el componente de contador
import ImageUpload from '../inputs/ImageUpload'; // Importa el componente de carga de imagen
import Input from '../inputs/Input'; // Importa el componente de entrada de texto
import axios from 'axios'; // Importa la librería Axios para hacer solicitudes HTTP
import toast from 'react-hot-toast'; // Importa la librería de notificaciones toast
import { useRouter } from 'next/navigation'; // Importa el hook useRouter de next/navigation

// Enumeración de pasos del proceso de creación del evento
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

// Componente RentModal
const RentModal = () => {
  const router = useRouter(); // Hook useRouter para acceder al enrutador de next.js
  const rentModal = useRentModal(); // Hook personalizado para el modal de alquiler

  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está cargando
  const [step, setStep] = useState(STEPS.CATEGORY); // Estado para almacenar el paso actual del proceso de creación del evento

  // Hook useForm para manejar el formulario y sus valores
  const { 
    register, // Función de registro de campos del formulario
    handleSubmit, // Función para manejar la presentación del formulario
    setValue, // Función para establecer valores en campos del formulario
    watch, // Función para observar cambios en los campos del formulario
    formState: { errors }, // Estado del formulario que contiene los errores
    reset // Función para restablecer los valores del formulario
  } = useForm<FieldValues>({ // Configuración del useForm con los valores iniciales del formulario
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    }
  });

  // Variables para observar los valores de los campos del formulario
  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  // Componente Map cargado dinámicamente cuando cambia la ubicación
  const Map = useMemo (() => dynamic(() => import('../Map'),{
    ssr: false
  }), [location]);
  
  // Función para establecer valores personalizados en campos del formulario
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  // Función para retroceder al paso anterior del proceso de creación del evento
  const onBack = () => {
    setStep((value) => value - 1);
  };

  // Función para avanzar al siguiente paso del proceso de creación del evento
  const onNext = () => {
    setStep((value) => value + 1);
  }

  // Función para manejar la presentación del formulario
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Si no estamos en el último paso, avanzamos al siguiente paso
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    // Si estamos en el último paso, creamos el listado
    setIsLoading(true); // Indicamos que se está cargando
    axios.post('/api/listings', data) // Enviamos los datos al servidor para crear el listado
    .then(() => { // Si la solicitud es exitosa
      toast.success('Listing created!'); // Mostramos una notificación de éxito
      router.refresh(); // Actualizamos la página
      reset(); // Restablecemos los valores del formulario
      setStep(STEPS.CATEGORY); // Volvemos al primer paso del proceso
      rentModal.onClose(); // Cerramos el modal
    })
    .catch(() => { // Si hay un error en la solicitud
      toast.error('An error occurred.'); // Mostramos una notificación de error
    })
    .finally(() => { // Después de que la solicitud termine (ya sea éxito o error)
      setIsLoading(false); // Indicamos que la carga ha terminado
    })
  }

  // Etiqueta de acción principal del modal (Crear o Siguiente)
  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create';
    }
    return 'Next';
  }, [step]);

  // Etiqueta de acción secundaria del modal (Atrás o Ninguna)
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  // Contenido del cuerpo del modal dependiendo del paso actual del proceso de creación del evento
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="¿Cuál de estos describe mejor tu Evento?"
        subtitle="Elige una categoría"
      />
      <div 
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => 
                setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  // Renderizado condicional del contenido del cuerpo del modal según el paso actual
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="¿Dónde se encuentra tu evento?"
          subtitle="Ayuda a tus amigos a encontrar tus eventos!"
        />
        <CountrySelect
          value={location} 
          onChange={(value) => setCustomValue('location', value)} 
        />
        <Map
          center={location?.latlng}
          zoom={15}
        />        
      </div>
    );
  }
  
  if (step === STEPS.INFO) {
    // Contenido del cuerpo del modal para el paso de información básica
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Comparte algunos aspectos básicos sobre tu evento"
          subtitle="Cuales son tus requisitos?"
        />
        <Counter 
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="Participantes" 
          subtitle="Cuantos participantes permite tu evento"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Etapas" 
          subtitle="¿Cuantas etapas manejara tu evento?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="Categorias" 
          subtitle="Cuantas categorias seran permitidas?"
        />
      </div>
    )
  }

  // Renderizado condicional del contenido del cuerpo del modal según el paso actual
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Agrega una foto"
          subtitle="Muestra a los participantes cómo sera tu evento!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />
      </div>
    )
  }

  // Renderizado condicional del contenido del cuerpo del modal según el paso actual
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="¿Cómo describirías tu evento?"
          subtitle="¡Divertido y emocionante suena mejor!"
        />
        <Input
          id="title"
          label="Titulo"
          disabled={isLoading}
          register={register}
          errors={errors}
          required 
        />
        <hr />
        <Input
          id="description"
          label="Descripcion"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  // Renderizado condicional del contenido del cuerpo del modal según el paso actual
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Ahora, establece tu precio"
          subtitle="¿Cuánto se cobra por carrera?"
        />
        <Input
          id="price"
          label="Precio"
          formatPrice 
          type="number" 
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

// Renderizado del componente Modal con el contenido del cuerpo correspondiente al paso actual
  return (
    <Modal
      isOpen={rentModal.isOpen} // Indica si el modal está abierto
      title="Ruta Veloz tus eventos!" // Título del modal
      actionLabel={actionLabel} // Etiqueta de la acción principal
      onSubmit={handleSubmit(onSubmit)} // Función de presentación del formulario
      secondaryActionLabel={secondaryActionLabel} // Etiqueta de la acción secundaria
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack} // Función de la acción secundaria
      onClose={rentModal.onClose} // Función de cierre del modal
      body={bodyContent} // Contenido del cuerpo del modal
    />
  );
}

// Exporta el componente RentModal
export default RentModal; 