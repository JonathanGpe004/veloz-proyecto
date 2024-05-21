'use client'
import React, { useState } from 'react';
import { Range } from "react-date-range";

import Button from "../Button";
import Calendar from "../inputs/Calendar";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: (formData: FormData) => void;
  disabled: boolean;
  disabledDates: Date[];
  bloodType?: string;
  socialSecurityNumber?: string;
  emergencyPhoneNumber?: string;
  category?: string;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  bloodType: string;
  socialSecurityNumber: string;
  emergencyPhoneNumber: string;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  bloodType,
  socialSecurityNumber,
  emergencyPhoneNumber,
  category
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodTypeValue, setBloodType] = useState(bloodType);
  const [ssn, setSocialSecurityNumber] = useState(socialSecurityNumber);
  const [emergencyPhone, setEmergencyPhoneNumber] = useState(emergencyPhoneNumber);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      phoneNumber,
      bloodType: bloodTypeValue ?? '',
      socialSecurityNumber: ssn ?? '',
      emergencyPhoneNumber: emergencyPhone ?? ''
    };
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          $ {price}
        </div>
        <div className="font-light text-neutral-600">
          {category}
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4">
          <label htmlFor="name" className="inline-block w-28">Nombre:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <div className="p-4">
          <label htmlFor="email" className="inline-block w-28">Correo electrónico:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <div className="p-4">
          <label htmlFor="phoneNumber" className="inline-block w-28">Teléfono:</label>
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <div className="p-4">
          <label htmlFor="bloodType" className="inline-block w-28">Tipo de sangre:</label>
          <input type="text" id="bloodType" value={bloodTypeValue} onChange={(e) => setBloodType(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <div className="p-4">
          <label htmlFor="ssn" className="inline-block w-28">Número de seguro médico:</label>
          <input type="text" id="ssn" value={ssn} onChange={(e) => setSocialSecurityNumber(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <div className="p-4">
          <label htmlFor="emergencyPhone" className="inline-block w-28">Teléfono de emergencia:</label>
          <input type="tel" id="emergencyPhone" value={emergencyPhone} onChange={(e) => setEmergencyPhoneNumber(e.target.value)} required className="border border-black rounded-md p-1" />
        </div>
        <hr />
        <div className="p-4">
          <Calendar
            value={dateRange}
            onChange={(value) => onChangeDate(value.selection)}
            disabledDates={disabledDates}
          />
        </div>
        <hr />
        <div className="p-4">
          <Button
            type="submit"
            disabled={disabled}
            label="Reservar"
          />
        </div>
      </form>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>
          Total
        </div>
        <div>
          $ {totalPrice}
        </div>
      </div>
    </div>
  );
};

export default ListingReservation;