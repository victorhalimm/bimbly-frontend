export interface Recommendation {
  label: string;
  value: string;
  type: 'subject' | 'province';
  icon: any;
  count?: number;
}