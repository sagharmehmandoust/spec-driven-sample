"use client";

import { ShapeVisual } from "@/components/editor/shape-visual";
import {
  CANVAS_TEMPLATES,
  type CanvasTemplate,
} from "@/components/editor/starter-templates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_EDGE_COLOR } from "@/types/canvas";

const PREVIEW_WIDTH = 280;
const PREVIEW_HEIGHT = 160;
const PREVIEW_PADDING = 16;

interface StarterTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: CanvasTemplate) => void;
}

interface PreviewBounds {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

function getPreviewBounds(template: CanvasTemplate): PreviewBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of template.nodes) {
    const width = node.width ?? 100;
    const height = node.height ?? 80;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, width: 1, height: 1 };
  }

  return {
    minX,
    minY,
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1),
  };
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const bounds = getPreviewBounds(template);
  const availableWidth = PREVIEW_WIDTH - PREVIEW_PADDING * 2;
  const availableHeight = PREVIEW_HEIGHT - PREVIEW_PADDING * 2;
  const scale = Math.min(
    availableWidth / bounds.width,
    availableHeight / bounds.height,
  );
  const offsetX =
    PREVIEW_PADDING + (availableWidth - bounds.width * scale) / 2;
  const offsetY =
    PREVIEW_PADDING + (availableHeight - bounds.height * scale) / 2;

  const nodeCenters = new Map(
    template.nodes.map((node) => {
      const width = node.width ?? 100;
      const height = node.height ?? 80;
      return [
        node.id,
        {
          x: offsetX + (node.position.x - bounds.minX + width / 2) * scale,
          y: offsetY + (node.position.y - bounds.minY + height / 2) * scale,
        },
      ] as const;
    }),
  );

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-surface-border bg-base"
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0"
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
      >
        {template.edges.map((edge) => {
          const source = nodeCenters.get(edge.source);
          const target = nodeCenters.get(edge.target);
          if (!source || !target) return null;

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke={DEFAULT_EDGE_COLOR}
              strokeWidth={1}
              strokeOpacity={0.45}
            />
          );
        })}
      </svg>

      {template.nodes.map((node) => {
        const width = (node.width ?? 100) * scale;
        const height = (node.height ?? 80) * scale;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: offsetX + (node.position.x - bounds.minX) * scale,
              top: offsetY + (node.position.y - bounds.minY) * scale,
              width,
              height,
            }}
          >
            <ShapeVisual shape={node.data.shape} fill={node.data.color} />
          </div>
        );
      })}
    </div>
  );
}

const modalContentClass =
  "gap-0 rounded-3xl border border-surface-border bg-elevated p-6 shadow-2xl ring-0 sm:max-w-3xl";

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={modalContentClass}>
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-lg font-semibold text-copy-primary">
            Starter Templates
          </DialogTitle>
          <DialogDescription className="text-sm text-copy-muted">
            Import a prebuilt system design. This replaces the current canvas.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-5 h-[min(60vh,28rem)]">
          <div className="grid grid-cols-1 gap-4 pr-3 sm:grid-cols-2">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface p-4"
              >
                <TemplatePreview template={template} />
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-copy-primary">
                    {template.name}
                  </h3>
                  <p className="text-xs text-copy-muted">
                    {template.description}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 w-full rounded-full bg-brand text-sm font-medium text-primary-foreground hover:bg-brand/90"
                  onClick={() => {
                    onImport(template);
                    onOpenChange(false);
                  }}
                >
                  Import
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
