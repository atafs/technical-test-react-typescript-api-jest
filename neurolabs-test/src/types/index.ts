export interface CatalogItem {
  id: string;
  name: string;
  thumbnail: string;
  status: string;
  description?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: {
    sku?: string;
    brand?: string;
    weight?: number;
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
  };
  image_count?: number;
}

export interface IRTask {
  uuid: string;
  name: string;
}

export interface ImageSubmission {
  image_id: string;
  task_uuid: string;
  status: string;
}

export interface TaskStatus {
  image_id: string;
  task_uuid: string;
  status: string;
  result?: {
    recognized_items: {
      item_id: string;
      confidence: number;
    }[];
  };
}

export {};
