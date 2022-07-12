import React, { cloneElement, FC, ReactElement } from 'react';

export interface GalleryWrapperProps {
  children: ReactElement;
  description: string;
  /** Convenience for setting `boxProps: {{ sx: {{ background: <string> | undefined; }}}}`.
   * Defaults to 'white'. Use 'unset' for transparent.
   * boxProps: {{ sx: ... }} will override.
   */
  bg?: string;
  /** Convenience for setting `style: {{ padding: '8px' }}`. Defaults to 8px. */
  p?: string;
  /** If provided overrides the global Gallery vertical mode setting. */
  verticalMode?: boolean;
  /** Used to group components in the gallery list together. Defaults to '~'. */
  g?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * GalleryWrapper defaults to p="8px" style={{height: '100%'}}.
 *
 * Can be modified with style={{ ... }}.
 */
const GalleryWrapper: FC<GalleryWrapperProps> = ({
  children,
  style,
  verticalMode,
  bg,
  p,
  className,
}) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        padding: typeof p === 'number' ? p : '8px',
        background: bg || 'white',
        overflowX: 'auto',
        overflowY: 'hidden',
        ...style,
      }}
      className={'galleryWrapper ' + className ? className : ''}
    >
      {cloneElement(children, { vertical: verticalMode })}
    </div>
  );
};

export default GalleryWrapper;
