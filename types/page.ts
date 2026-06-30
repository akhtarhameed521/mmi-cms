export type PageStatus = "Draft" | "Published";

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  description?: string;
  status?: PageStatus;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  description?: string;
  status?: PageStatus;
}
