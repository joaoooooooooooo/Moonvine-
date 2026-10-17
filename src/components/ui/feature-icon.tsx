import type { HTMLAttributes } from 'react';
import type { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import './feature-icon.css';

export type FeatureIconVariant = 'purple' | 'emerald' | 'amber' | 'blue';

export interface FeatureIconProps extends HTMLAttributes<HTMLSpanElement> {
  icon: Icon;
  variant: FeatureIconVariant;
  size?: 'md' | 'lg';
  weight?: 'regular' | 'fill';
}

export function FeatureIcon({ icon: Glyph, variant, size = 'md', weight = 'fill', className, ...props }: FeatureIconProps) {
  return (
    <span
      data-slot="feature-icon"
      data-variant={variant}
      data-size={size}
      className={cn('feature-icon inline-flex shrink-0 items-center justify-center', className)}
      {...props}
    >
      <Glyph aria-hidden="true" className="feature-icon__glyph" weight={weight} />
    </span>
  );
}
