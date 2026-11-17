import type { CategoryId } from "../services-catalog";

export type ServiceOverride = {
  enabled?: boolean;
  description?: string;
};

export type CustomService = {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  enabled: boolean;
};

export type ServiceSettings = {
  overrides: Record<string, ServiceOverride>;
  custom: CustomService[];
};

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  /** YYYY-MM-DD */
  date: string;
  source: string;
  service?: string;
  published: boolean;
  /** true when submitted by a customer through the website (needs approval) */
  submittedOnline?: boolean;
  phone?: string;
  email?: string;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  service: string;
  before?: string;
  after?: string;
  published: boolean;
  createdAt: string;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  google?: string;
  yelp?: string;
  nextdoor?: string;
};

export type SiteSettings = {
  social: SocialLinks;
  googleReviewUrl?: string;
  announcement?: string;
};

export type SubmissionType = "booking" | "estimate" | "contact";
export type SubmissionStatus = "new" | "contacted" | "scheduled" | "completed" | "declined";

export type Submission = {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  /** Ordered label → value pairs exactly as shown to the business. */
  fields: [string, string][];
  /** Storage keys of uploaded photos (private). */
  photos: string[];
  notes?: string;
  emailed?: boolean;
};

export type DocKey = "services" | "reviews" | "gallery" | "settings";

export type StoredFile = { data: Buffer; contentType: string };

export type Visibility = "public" | "private";

export interface StoreDriver {
  readonly kind: string;
  readDoc<T>(key: DocKey): Promise<T | null>;
  writeDoc<T>(key: DocKey, value: T): Promise<void>;

  createSubmission(s: Submission): Promise<void>;
  listSubmissions(): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | null>;
  updateSubmission(id: string, patch: Partial<Submission>): Promise<void>;
  deleteSubmission(id: string): Promise<void>;

  putFile(visibility: Visibility, key: string, file: StoredFile): Promise<void>;
  getFile(visibility: Visibility, key: string): Promise<StoredFile | null>;
  deleteFile(visibility: Visibility, key: string): Promise<void>;
}
