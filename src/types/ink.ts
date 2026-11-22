export type ScaleConnectionType = 'WEB_SERIAL' | 'WEB_BLUETOOTH' | 'SIMULATOR';

export type ProcessType = 'FLEXO' | 'LETTER';

export interface ScaleConfig {
  portLabel: string;
  preferredConnection?: ScaleConnectionType;
  bluetoothDeviceName?: string;
  bluetoothServiceUuid?: string;
  baudRate: number;
  dataBits: 7 | 8;
  stopBits: 1 | 2;
  parity: 'none' | 'even' | 'odd';
  protocol: 'PRIX_P03' | 'PRIX_CONTINUOUS' | 'FILIZOLA' | 'GENERIC_ASCII';
  tolerancePercent: number;
  toleranceMinGrams: number;
  stabilitySamples: number;
  stabilityDeltaGrams: number;
  simulatorEnabled: boolean;
  calibrationFactor?: number;
  calibrationOffsetGrams?: number;
  lastCalibratedAt?: string;
}

export interface PantoneLiveConfig {
  enabled: boolean;
  mode: 'FREE_PUBLIC' | 'CORPORATE_ACCOUNT';
  serverUrl: string;
  library: string;
  username?: string;
  password?: string;
  lastCheckOk?: boolean;
  lastCheckedAt?: string;
  lastError?: string;
}

export interface ColorRef {
  hex?: string;
  pantone?: string;
  rgb?: string;
  lab?: { L: number; a: number; b: number };
}

export interface FormulaComponent {
  codeSap: string;
  name: string;
  percentage: number;
  grams?: number;
  supplier?: string;
  expiryDate?: string;
}

export interface LoteFormula {
  id: string;
  loteNumber: string;
  currentVersion: number;
  process: ProcessType;
  colorName: string;
  colorCode: string;
  product: string;
  sapCode: string;
  machine: string;
  description: string;
  colorRef: ColorRef;
  components: FormulaComponent[];
  totalGrams: number;
  createdBy: string;
  createdAt: string;
  validity?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface AssortmentInk {
  id: string;
  assortmentCode: string;
  name: string;
  supplierName: string;
  series: string;
  ciPigment?: string;
  role: 'BASE' | 'PIGMENT' | 'WHITE' | 'BLACK' | 'VARNISH' | 'ADDITIVE';
  stockKg: number;
  minStockKg: number;
  estimatedCostPerKgBrl: number;
  equivalentCodes: string[];
  specificWeight?: number;
  lastUpdated: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'ADMIN' | 'COLORISTA' | 'OPERADOR' | 'VIEWER';
  provider: 'google' | 'microsoft' | 'email';
}

export interface SystemSettings {
  scale: ScaleConfig;
  pantoneLive: PantoneLiveConfig;
  companyName: string;
  plantCode: string;
}
