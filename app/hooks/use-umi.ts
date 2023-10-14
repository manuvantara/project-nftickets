import { useContext } from 'react';
import { UmiContext } from '../providers/umi-provider';

export default function useUmi() {
  const context = useContext(UmiContext);
  if (!context) throw new Error('useUmi must be used within a UmiProvider');
  return context;
}
