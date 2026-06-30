/**
 * Application Constants
 */

export const APP_NAME = "CMS Builder";
export const VERSION = "1.0.0";

export const ROLES = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
} as const;

export const PAGE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
} as const;

export const BUILDER_LIMITS = {
  MAX_BLOCKS_PER_PAGE: 50,
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_UPLOAD_SIZE_MB: 5,
} as const;

export const API_ROUTES = {
  AUTH: "/api/auth",
  USERS: "/api/users",
  PAGES: "/api/pages",
  BLOCKS: "/api/blocks",
  UPLOAD: "/api/upload",
  BUILDER: "/api/builder",
} as const;
