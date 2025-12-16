export interface ProvinceConfig {
  name: string;
  label: string;
}

export const PROVINCES: ProvinceConfig[] = [
  { name: 'DKI Jakarta', label: 'DKI Jakarta' },
  { name: 'Jawa Barat', label: 'Jawa Barat' },
  { name: 'Jawa Tengah', label: 'Jawa Tengah' },
  { name: 'Jawa Timur', label: 'Jawa Timur' },
  { name: 'Banten', label: 'Banten' },
  { name: 'Yogyakarta', label: 'Yogyakarta' },
  { name: 'Bali', label: 'Bali' },
  { name: 'Sumatera Utara', label: 'Sumatera Utara' },
  { name: 'Sumatera Selatan', label: 'Sumatera Selatan' },
  { name: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
];

export const PROVINCE_NAMES = PROVINCES.map(p => p.name);
