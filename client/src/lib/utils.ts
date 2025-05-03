import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToElement(id: string, yOffset = -80) {
  let element = document.getElementById(id);

  if (!element) {
    element = document.getElementById(id.toLowerCase());
  }

  if (!element) {
    element = document.querySelector(
      `[data-section="${id}"], section#${id}, div#${id}`,
    );
  }

  if (!element && (id === 'videos' || id === 'press' || id === 'gallery')) {
    element = document.getElementById(`media-${id}`);
  }

  if (!element) {
    console.warn(`Could not find element with ID: ${id}`);
    return;
  }

  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
}

export function useScrollToHash(defaultOffset = -80) {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hash) {
        const id = hash.substring(1);
        scrollToElement(id, defaultOffset);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [hash, pathname, defaultOffset]);
}
