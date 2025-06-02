export interface CatalogItem {
  id: string; // Mapped from uuid in ApiService
  uuid: string;
  name: string;
  thumbnail_url: string;
  status: string; // e.g., "READY", "PROCESSING"
  barcode?: string | null;
  custom_id?: string | null;
  height?: number | null;
  width?: number | null;
  depth?: number | null;
  brand?: string | null;
  size?: string | null;
  container_type?: string | null;
  flavour?: string | null;
  packaging_size?: string | null;
  created_at: string;
  updated_at: string;
  // Optional fields for CatalogItemCard compatibility, not in API
  description?: string;
  category?: string;
  metadata?: { brand?: string };
  image_count?: number;
}

export interface IRTask {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  compute_realogram: boolean;
  compute_shares: boolean;
}

export interface ImageSubmission {
  image_id: string;
  status: string;
}

export interface TaskStatus {
  status: string;
  result?: any;
}
