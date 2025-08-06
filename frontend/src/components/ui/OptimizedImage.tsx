import React from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  webpSrc?: string;
  mobileSrc?: string;
  mobileWebpSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes = "100vw",
  webpSrc,
  mobileSrc,
  mobileWebpSrc
}: OptimizedImageProps) {
  // If we have WebP and mobile sources, use picture
  if (webpSrc || mobileSrc || mobileWebpSrc) {
    return (
      <picture className={className}>
        {/* WebP mobile */}
        {mobileWebpSrc && (
          <source
            srcSet={mobileWebpSrc}
            type="image/webp"
            media="(max-width: 767px)"
          />
        )}
        {/* WebP desktop */}
        {webpSrc && (
          <source
            srcSet={webpSrc}
            type="image/webp"
            media="(min-width: 768px)"
          />
        )}
        {/* JPG mobile */}
        {mobileSrc && (
          <source
            srcSet={mobileSrc}
            type="image/jpeg"
            media="(max-width: 767px)"
          />
        )}
        {/* JPG desktop */}
        <source
          srcSet={src}
          type="image/jpeg"
          media="(min-width: 768px)"
        />
        {/* Default image */}
        <img
          src={src}
          alt={alt}
          className={className}
          loading={loading}
          sizes={sizes}
        />
      </picture>
    );
  }

  // Otherwise, simple image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      sizes={sizes}
    />
  );
} 