/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkshopData {
  timestamp?: string;
  projectName: string;
  groupNumber: string;
  category: string;
  content: string;
  confidence: number;
}

export interface AnalysisResult {
  items: WorkshopData[];
  summary: string;
}

export interface SheetConfig {
  spreadsheetId?: string;
  sheetName?: string;
}
