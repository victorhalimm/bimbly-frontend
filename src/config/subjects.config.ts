import {
  IconMath,
  IconAtom,
  IconFlask2,
  IconPlant,
  IconLanguage,
  IconLetterA,
  IconWorld,
  IconCoin,
  IconArticle,
  IconDeviceDesktop,
  IconFriends,
  IconBook,
} from '@tabler/icons-vue';
import type { Component } from 'vue';

export interface SubjectConfig {
  name: string;
  label: string;
  icon: Component;
  iconName: string;
  gradient: string;
  badgeClass: string;
}

export const SUBJECTS: SubjectConfig[] = [
  {
    name: 'Matematika',
    label: 'Matematika',
    icon: IconMath,
    iconName: 'IconMath',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Fisika',
    label: 'Fisika',
    icon: IconAtom,
    iconName: 'IconAtom',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Kimia',
    label: 'Kimia',
    icon: IconFlask2,
    iconName: 'IconFlask2',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'Biologi',
    label: 'Biologi',
    icon: IconPlant,
    iconName: 'IconPlant',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    badgeClass: 'bg-green-100 text-green-700',
  },
  {
    name: 'Bahasa Indonesia',
    label: 'Bahasa Indonesia',
    icon: IconLanguage,
    iconName: 'IconLanguage',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    badgeClass: 'bg-red-100 text-red-700',
  },
  {
    name: 'Bahasa Inggris',
    label: 'Bahasa Inggris',
    icon: IconLetterA,
    iconName: 'IconLetterA',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  {
    name: 'IPA',
    label: 'IPA',
    icon: IconAtom,
    iconName: 'IconAtom',
    gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    badgeClass: 'bg-cyan-100 text-cyan-700',
  },
  {
    name: 'IPS',
    label: 'IPS',
    icon: IconWorld,
    iconName: 'IconWorld',
    gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Ekonomi',
    label: 'Ekonomi',
    icon: IconCoin,
    iconName: 'IconCoin',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  {
    name: 'Geografi',
    label: 'Geografi',
    icon: IconWorld,
    iconName: 'IconWorld',
    gradient: 'bg-gradient-to-br from-teal-500 to-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'Sejarah',
    label: 'Sejarah',
    icon: IconArticle,
    iconName: 'IconArticle',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'PKN',
    label: 'PKN',
    icon: IconFriends,
    iconName: 'IconFriends',
    gradient: 'bg-gradient-to-br from-rose-500 to-rose-600',
    badgeClass: 'bg-rose-100 text-rose-700',
  },
  {
    name: 'Informatika',
    label: 'Informatika',
    icon: IconDeviceDesktop,
    iconName: 'IconDeviceDesktop',
    gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
];

export const DEFAULT_SUBJECT_CONFIG: SubjectConfig = {
  icon: IconBook,
  iconName: 'IconBook',
  gradient: 'bg-gradient-to-br from-gray-500 to-gray-600',
  badgeClass: 'bg-gray-100 text-gray-700',
  name: '',
  label: '',
};

export const SUBJECT_NAMES = SUBJECTS.map(s => s.name);

export const SUBJECT_MAP = new Map<string, SubjectConfig>(
  SUBJECTS.map(s => [s.name, s])
);

export function getSubjectConfig(name: string): SubjectConfig {
  return SUBJECT_MAP.get(name) || {
    ...DEFAULT_SUBJECT_CONFIG,
  };
}

export function getSubjectIcon(name: string): Component {
  return getSubjectConfig(name).icon;
}

export function getSubjectIconName(name: string): string {
  return getSubjectConfig(name).iconName;
}

export function getSubjectGradient(name: string): string {
  return getSubjectConfig(name).gradient;
}

export function getSubjectBadgeClass(name: string): string {
  return getSubjectConfig(name).badgeClass;
}
