'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons';
import useCountries from '@/app/hooks/useCountries';
import ListingCategory from './ListingCategory';
import Avatar from '../Avatar';
import axios from 'axios';
import { SafeUser } from "@/app/types";

///
import countries from 'world-countries';

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region
}));
////

const Map = dynamic(() => import('../Map'), { ssr: false });

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: {
    icon: IconType;
    label: string;
    description: string;
  } | undefined;
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue
}) => {
 const { getByValue } = useCountries();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${locationValue}&key=AIzaSyASJd3q162tWUYekIEyZfPR0Y06ZB1o-HI`
        );
        const { lat, lng } = response.data.results[0].geometry.location;

        setCoordinates({ lat, lng });
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (locationValue) {
      fetchCoordinates();
    }
  }, [locationValue]);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">

        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Anfitrión {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} Participantes</div>
          <div>{roomCount} Etapas</div>
          <div>{bathroomCount} Categorias</div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory icon={category.icon} label={category?.label} description={category?.description} />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">{description}</div>
      <hr />
      {coordinates ? (
        <Map center={[coordinates.lat, coordinates.lng]} zoom={12} />
      ) : (
        <div>No se encontraron coordenadas para mostrar el mapa.</div>
      )}
    </div>
  );
};
export default ListingInfo;
