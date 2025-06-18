export interface ManufactureNum {
  num: string;
  year: string;
  modification: string;
  structure: string;
  additionalInfo: string;
}

export interface Uve {
  number: string;
  custom?: string;
}

export interface Ses {
  typeNum: string;
  manufactureYear: string;
  manufactureNum: string;
  metroChars: string;
  custom?: string;
}

export interface Mi {
  typeNum: string;
  manufactureNum: string;
  custom?: string;
}

export interface VerificationConditions {
  temperature: string;
  pressure: string;
  humidity: string;
  other: string;
}

export interface XMLFormData {
  mitypeNumber: string;
  manufactureNums: ManufactureNum[];
  signCipher: string;
  miOwner: string;
  vrfDate: string;
  interval: number;
  type: string;
  calibration: boolean;
  stickerNum: string;
  signPass: boolean;
  signMi: boolean;
  docTitle: string;
  metrologist: string;
  conditions: VerificationConditions;
  uve: Uve[];
  ses: Ses[];
  mis: Mi[];
} 