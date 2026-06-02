// Per-service creative visual theme: each service gets its own gradient
// and a unique illustration / photo for distinctive cards and hero areas.
export const SERVICE_VISUALS = {
  "website-development": {
    gradient: "from-[#1E5BFF] to-[#6B3CF5]",
    soft: "from-[#1E5BFF]/15 to-[#6B3CF5]/10",
    accent: "#1E5BFF",
    icon: "Globe2",
    cover:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
  },
  "landing-page-development": {
    gradient: "from-[#22D3EE] to-[#3B82F6]",
    soft: "from-[#22D3EE]/15 to-[#3B82F6]/10",
    accent: "#22D3EE",
    icon: "LayoutTemplate",
    cover:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
  "email-template-development": {
    gradient: "from-[#F97316] to-[#EF4444]",
    soft: "from-[#F97316]/15 to-[#EF4444]/10",
    accent: "#F97316",
    icon: "MailOpen",
    cover:
      "https://images.unsplash.com/photo-1526554850534-7c78330d5f90?auto=format&fit=crop&w=1200&q=80",
  },
  "email-signature-design": {
    gradient: "from-[#8B5CF6] to-[#EC4899]",
    soft: "from-[#8B5CF6]/15 to-[#EC4899]/10",
    accent: "#8B5CF6",
    icon: "Signature",
    cover:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
  },
  "logo-creation": {
    gradient: "from-[#F59E0B] to-[#D946EF]",
    soft: "from-[#F59E0B]/15 to-[#D946EF]/10",
    accent: "#D946EF",
    icon: "PenTool",
    cover:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
  },
  "sticker-creation": {
    gradient: "from-[#10B981] to-[#22D3EE]",
    soft: "from-[#10B981]/15 to-[#22D3EE]/10",
    accent: "#10B981",
    icon: "Sticker",
    cover:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
  },
  "photo-restoration": {
    gradient: "from-[#A78BFA] to-[#F472B6]",
    soft: "from-[#A78BFA]/15 to-[#F472B6]/10",
    accent: "#A78BFA",
    icon: "ImageIcon",
    cover:
      "https://images.unsplash.com/photo-1502117859338-fd9daa518a9a?auto=format&fit=crop&w=1200&q=80",
  },
};

export const DEFAULT_VISUAL = {
  gradient: "from-[#1E5BFF] to-[#6B3CF5]",
  soft: "from-[#1E5BFF]/15 to-[#6B3CF5]/10",
  accent: "#1E5BFF",
  icon: "Briefcase",
  cover: null,
};

export function getServiceVisual(slug) {
  return SERVICE_VISUALS[slug] || DEFAULT_VISUAL;
}
