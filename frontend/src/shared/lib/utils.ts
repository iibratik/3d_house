
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AMENITY_LABELS } from "./amenities";
import { Apartament, ApartmentType, Block } from "@/entities/Complex/model/types";



type AreaValues = 'city' | 'district' | 'street' | 'house'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVisibleAmenities(complex: { amenities?: Record<string, number>[] } | null): string[] {
  if (!complex?.amenities?.length) return [];

  return Object.entries(complex.amenities[0])
    .filter(([key, value]) => value === 1 && key in AMENITY_LABELS)
    .map(([key]) => AMENITY_LABELS[key]);
}

export function formatPrice(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0';

  const absValue = Math.abs(value);
  const suffixes: { limit: number; suffix: string }[] = [
    { limit: 1e12, suffix: 'трлн' },
    { limit: 1e9, suffix: 'млрд' },
    { limit: 1e6, suffix: 'млн' },
    { limit: 1e3, suffix: 'тыс.' }
  ];

  for (const { limit, suffix } of suffixes) {
    if (absValue >= limit) {
      const formatted = (value / limit).toFixed(1).replace(/\.0$/, '');
      return `${formatted} ${suffix}`;
    }
  }

  return value.toString();
}
export function formatAddress(adress: string, area: AreaValues): string {
  const parts = adress.split(',').map(part => part.trim());
  const areaParts = area.split(',').map(a => a.trim());

  const map: Record<string, string | undefined> = {
    city: parts[0],
    district: parts[1],
    street: parts[2],
    house: parts[3],
  };

  const result = areaParts.map(a => map[a]).filter(Boolean).join(', ');
  return result;
}

export function getStatusInfo(status: string, completionDate?: string) {
  switch (status) {
    case 'ready':
      return { text: 'Сдан', color: 'bg-green-100 text-green-800' };
    case 'construction':
      return { text: 'Строится', color: 'bg-yellow-100 text-yellow-800' };
    case 'planned':
      return { text: completionDate || 'Планируется', color: 'bg-blue-100 text-blue-800' };
    default:
      return { text: 'Не указан', color: 'bg-gray-100 text-gray-800' };
  }
};

export function getApartmentTypeName(
  typeId: number,
): string {
  const apartmentTypes: ApartmentType[] = [
    { id: 1, name: 'студия' },
    { id: 2, name: '1-комнатная' },
    { id: 3, name: '2-комнатная' },
    { id: 4, name: '3-комнатная' },
    { id: 5, name: '4-комнатная' },
  ];
  const found = apartmentTypes.find((type) => type.id === typeId);
  return found ? found.name : 'Неизвестный тип';
};
export function parseFloorString(floorStr: string): { block: string; floor: string } | null {
  const match = floorStr.match(/^([A-F])Floor(\d{1,2})$/);
  if (!match) return null;
  return {
    block: match[1],
    floor: match[2],
  };
}
export function getRoomLabel(typeId: number): string {
  switch (typeId) {
    case 1:
      return 'Студия';
    case 2:
      return '1 - комнатная';
    case 3:
      return '2 - комнатная';
    case 4:
      return '3 - комнатная';
    case 5:
      return '4 - комнатная';
    default:
      return `${typeId}`;
  }
}