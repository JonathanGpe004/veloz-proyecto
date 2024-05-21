import countries from 'world-countries'; // Importa la lista de países desde el paquete 'world-countries'

// Formatea la lista de países para que tenga la estructura deseada
const formattedCountries = countries.map((country) => ({
  value: country.cca2, // Código ISO-3166-1 alfa-2 del país
  label: country.name.common, // Nombre común del país
  flag: country.flag, // URL de la bandera del país
  latlng: country.latlng, // Coordenadas latitud y longitud del país
  region: country.region // Región del mundo a la que pertenece el país
}));

// Hook personalizado para manejar la lista de países
const useCountries = () => {
  // Función para obtener todos los países formateados
  const getAll = () => formattedCountries;

  // Función para obtener un país por su código ISO-3166-1 alfa-2
  const getByValue = (value: string) => {
    const country = formattedCountries.find((item) => item.value === value); // Busca el país por su código
    if (country) { // Si se encuentra el país
      return country; // Devuelve el país encontrado
    }
    // Si no se encuentra el país, devuelve un objeto con el código como valor y etiqueta
    return {
      value: value, 
      label: value, 
    };
  }

  return {
    getAll, // Función para obtener todos los países formateados
    getByValue // Función para obtener un país por su código
  }
};

export default useCountries; // Exporta el hook personalizado useCountries por defecto

