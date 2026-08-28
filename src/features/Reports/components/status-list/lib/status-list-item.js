export const statusListItemVariants = {
  default: {
    badgeVariant: "label",
    className: "",
    labelClassName: "text-foreground",
  },
  disabled: {
    badgeVariant: "secondary",
    className: "opacity-23",
    labelClassName: "text-muted-foreground",
  },
  info: {
    badgeVariant: "info",
    className: "",
    labelClassName: "text-foreground",
  },
  success: {
    badgeVariant: "success",
    className: "",
    labelClassName: "text-foreground",
  },
  warning: {
    badgeVariant: "warning",
    className: "",
    labelClassName: "text-foreground",
  },
};

export function getStatusListItemVariant(variant = "default") {
  return statusListItemVariants[variant] ?? statusListItemVariants.default;
}
