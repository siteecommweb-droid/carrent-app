export interface Car {
  id: number;

  make: string;

  model: string;

  year?: number;

  color?: string;

  seats?: number;

  daily_price: number;

  status?: string;

  transmission?: string;

  fuel_type?: string;

  image?: string;

  horsepower?: string;

  engine?: string;

  location?: string;

  availability_status?: string;

  features_json?: string[] | string;

  specs_json?:
    | Record<string, any>
    | string;

  name?: string;

  price?: number;
}