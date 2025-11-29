export interface StyleReport {
  skinToneAnalysis: {
    undertone: string;
    description: string;
    seasonType: string;
  };
  bodyTypeAnalysis: {
    type: string;
    strengths: string[];
    stylingFocus: string;
  };
  bestColors: Array<{
    color: string;
    hex: string;
    reason: string;
  }>;
  colorsToAvoid: Array<{
    color: string;
    hex: string;
    reason: string;
  }>;
  bestPatterns: Array<{
    pattern: string;
    reason: string;
  }>;
  signatureLooks: Array<{
    name: string;
    description: string;
    keyPieces: string[];
    occasion: string;
  }>;
  stylingTips: string[];
  accessoryGuide: {
    jewelry: string;
    bags: string;
    shoes: string;
  };
}
