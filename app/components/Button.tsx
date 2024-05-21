'use client'; 

import React, { ButtonHTMLAttributes } from "react"; // Importa funciones y tipos de React
import { IconType } from "react-icons"; // Importa el tipo IconType de react-icons

// Props del componente Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // Texto del botón
  outline?: boolean; // Indica si el botón tiene un borde de contorno
  small?: boolean; // Indica si el botón es pequeño
  icon?: IconType; // Tipo de icono a mostrar en el botón
}

// Componente funcional Button
const Button: React.FC<ButtonProps> = ({ 
  label, // Texto del botón
  outline, // Indica si el botón tiene un borde de contorno
  small, // Indica si el botón es pequeño
  icon: Icon, // Icono a mostrar en el botón
  ...props // Resto de props del botón
}) => {
  return ( 
    <button
      {...props} // Propaga todas las props adicionales al botón
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? 'bg-white' : 'bg-rose-500'} // Clase de color de fondo dependiendo de si es un botón de contorno
        ${outline ? 'border-black' : 'border-rose-500'} // Clase de color de borde dependiendo de si es un botón de contorno
        ${outline ? 'text-black' : 'text-white'} // Clase de color de texto dependiendo de si es un botón de contorno
        ${small ? 'text-sm' : 'text-md'} // Clase de tamaño de texto dependiendo de si es un botón pequeño
        ${small ? 'py-1' : 'py-3'} // Clase de relleno vertical dependiendo de si es un botón pequeño
        ${small ? 'font-light' : 'font-semibold'} // Clase de peso de fuente dependiendo de si es un botón pequeño
        ${small ? 'border-[1px]' : 'border-2'} // Clase de grosor de borde dependiendo de si es un botón pequeño
      `}
    >
      {Icon && ( // Renderiza el icono si está definido
        <Icon
          size={24} // Tamaño del icono
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      {label} {/* Renderiza el texto del botón */}
    </button>
   );
}
 
export default Button; // Exporta el componente Button por defecto
