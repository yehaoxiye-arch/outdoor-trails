export type Difficulty = "简单" | "中等" | "困难" | "极难";

export type RouteStyle = "轻装速穿" | "重装露营" | "越野跑";

export interface RouteStyleData {
  name: RouteStyle;
  distance: string;
  duration: string;
  altitude: string;
  difficulty: Difficulty;
  description: string;
  weightRange: string; // 负重范围，如 "5-8kg"
  timeReduction: string; // 时间压缩比例，如 "30-50%"
}

export interface Route {
  id: string;
  name: string;
  province: string;
  location: string;
  mountainRange?: string; // 所属山脉
  image: string;
  image2?: string; // 第二张图片
  styles: RouteStyleData[]; // 多种走法
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RouteSearchParams {
  query?: string;
  province?: string;
  difficulty?: Difficulty;
  style?: RouteStyle;
}
