import React, { useState, useEffect } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import axios from 'axios';

interface CitySelectValue {
  label: string;
  value: string;
  latlng: [number, number];
}

interface CitySelectProps {
  value?: CitySelectValue | null; 
  onChange: (newValue: CitySelectValue | null, actionMeta: ActionMeta<CitySelectValue>) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<CitySelectValue[]>([]);

  useEffect(() => {
    if (inputValue.length < 2) return; 

    const searchCities = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}&addressdetails=1&limit=10`
        );

        const cities: CitySelectValue[] = response.data.map((city: any) => ({
          label: city.display_name,
          value: city.display_name,
          latlng: [parseFloat(city.lat), parseFloat(city.lon)],
        }));

        setOptions(cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    const timeoutId = setTimeout(searchCities, 500); 

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  return (
    <Select
      placeholder="Buscar una ciudad"
      isClearable
      options={options}
      value={value}
      onChange={(newValue, actionMeta) => onChange(newValue, actionMeta)}
      onInputChange={handleInputChange}
    />
  );
};

export default CitySelect;
