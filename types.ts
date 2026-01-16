
export enum LabStatus {
  NORMAL = 'Normal',
  ABNORMAL = 'Abnormal',
  CRITICAL = 'Critical',
  UNKNOWN = 'Unknown'
}

export interface LabResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: LabStatus;
  explanation: string;
}

export interface LabReport {
  id: string;
  fileName: string;
  uploadDate: string;
  summary: string;
  results: LabResult[];
  disclaimer: string;
  notes: string;
}

export interface UserSession {
  id: string;
  email: string;
}
