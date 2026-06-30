export type BlockType = "hero" | "features" | "cta" | "text" | "image";

export interface BuilderBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  settings?: Record<string, any>;
}

export interface CanvasState {
  pageId: string;
  blocks: BuilderBlock[];
  selectedBlockId: string | null;
}

export interface BlockDefinition {
  type: BlockType;
  title: string;
  description: string;
  icon: string;
}
