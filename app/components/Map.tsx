'use client';

//Importamos las funciones necesarias de React
import React, { useRef, useEffect } from 'react';

//Declaramos un componente de función llamado Map, que recibe dos propiedades: 
//center (un array de dos números o que tambien puede ser indefinido) y zoom (un número)
const Map: React.FC<{ center: [number, number] | undefined; zoom: number }> = ({ center, zoom }) => {
    const mapRef = useRef<HTMLDivElement>(null);

//Asignamos el valor de center a validCenter 
//Si center es undefined, se utiliza [0, 0] como valor predeterminado
    const validCenter = center || [0, 0];

//Se utiliza el hook useEffect para ejecutar código cuando el valor de validCenter cambie
//Esto se utiliza para cargar el script de la API de Google Maps y inicializar el mapa
    useEffect(() => {
        if (!validCenter || !mapRef.current) return;

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASJd3q162tWUYekIEyZfPR0Y06ZB1o-HI`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);

        //Devuelve una función de limpieza que se ejecutara cuando el componente se desmonte
        return () => {
            document.head.removeChild(script);
        };
    }, [validCenter]);

    //Define la función initializeMap, que crea un nuevo mapa de Google y un marcador en el centro especificado
    const initializeMap = () => {
        if (!center || !mapRef.current) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: center[0], lng: center[1] },
            zoom,
        });

        new window.google.maps.Marker({
            position: { lat: center[0], lng: center[1] },
            map,
        });
    };

    //Renderiza un div que actúa como contenedor del mapa. La referencia mapRef se utiliza para asignar este div al elemento mapRef
    //Se establece el estilo para que el mapa tenga una altura de 400 píxeles y un ancho del 100% del contenedor padre
    return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

//Exporta el componente Map para que pueda ser utilizado en otros archivos 
export default Map;


