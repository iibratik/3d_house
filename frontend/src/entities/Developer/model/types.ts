
export interface Developer {
  id: number;
  name: string;
  logo: string;
  description: string;
  phoneNumber: string;
  email: string;
  website: string;
  address: string;
  founded: string;
}

export interface DeveloperProps {
  developer: Developer
}