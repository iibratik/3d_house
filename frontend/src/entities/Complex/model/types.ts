
export interface Location {
    city: string;
    district: string;
}


export type ComplexStatus = 'ready' | 'construction' | 'planned';

export type Amenity = {
    complexId: number,
    hasMetro: 0 | 1,
    hasKindergarden: 1 | 0,
    hasSchool: 0 | 1,
    hasHospital: 0 | 1,
    hasPlayground: 0 | 1,
    hasParking: 0 | 1,
    hasShops: 1 | 0,

}

export interface Complex {
    id: number;
    developerId: number,
    description: string,
    name: string;
    address: string;
    filterPrice: string,
    price: number;
    status: ComplexStatus;
    squareMin: string;
    squareMax: string;
    floors: number;
    uri: string;
    amenities: Amenity[];
    date?: string,
}

export interface ComplexFilters {
    cityValue?: string;
    cityRange: { label: string; value: string, }[]
    priceRangeValue?: string;
    priceRange: { label: string; value: string, }[]
    areaRangeValue?: string;
    areaRange: { label: string; value: string, }[]
    roomsValue?: string;
    roomRange: { label: string; value: string, }[]
    statusValue?: ComplexStatus;
    statusRange: { label: string; value: 'ready' | 'construction' | 'planned' }[]
}

export interface Block {
    id: number;
    complexId: number;
    name: string;
}
export interface Apartament {
    id: number;
    blockId: number,
    apartamentNumber: string,
    floor: number,
    typeId: number
}
export interface ApartmentType {
    id: number;
    name: string;
};