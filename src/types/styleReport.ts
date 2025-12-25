export interface StyleReport {
  skinToneAnalysis: {
    undertone: string;
    description: string;
    seasonType: string;
    colorTemperature?: string;
    metalPreference?: string;
  };
  bodyTypeAnalysis: {
    type: string;
    strengths: string[];
    stylingFocus: string;
    avoidStyles?: string[];
    fitTips?: string;
  };
  bestColors: Array<{
    color: string;
    hex: string;
    reason: string;
    howToWear?: string;
  }>;
  colorsToAvoid: Array<{
    color: string;
    hex: string;
    reason: string;
    alternative?: string;
  }>;
  bestPatterns: Array<{
    pattern: string;
    reason: string;
    examples?: string;
  }>;
  signatureLooks: Array<{
    name: string;
    description: string;
    keyPieces: string[];
    occasion: string;
    stylingNotes?: string;
    confidenceBooster?: string;
  }>;
  stylingTips: string[];
  accessoryGuide: {
    jewelry: string;
    bags: string;
    shoes: string;
    scarves?: string;
    belts?: string;
  };
  shoppingGuide?: {
    investmentPieces: string[];
    budgetFriendly: string[];
    brandsToExplore: string[];
  };
  seasonalWardrobe?: {
    capsuleEssentials: string[];
    statementPieces: string[];
    layeringTips: string;
  };
}

export interface PhotoAnalysisResult {
  isHuman: boolean;
  photo_id?: string;
  photo_url?: string;
  error?: string;
  analysis?: {
    body_type: string;
    skin_tone: string;
    skin_undertone?: string;
    hair_color: string;
    face_shape?: string;
    style_personality?: string;
    measurements?: {
      estimated_height_range: string;
      body_proportions: string;
      shoulder_type: string;
    };
    recommended_colors: string[];
    avoid_colors: string[];
    style_notes: string[];
  };
  analyzed_at?: string;
}
