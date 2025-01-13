import { useEffect } from 'react';
import { logger } from '@/services/logger';

interface UsePageTitleOptions {
  title: string;
  description?: string;
}

export const usePageTitle = ({ title, description }: UsePageTitleOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Buntudelice`;
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const previousDescription = metaDescription.getAttribute('content');
        metaDescription.setAttribute('content', description);
        
        logger.info('Updated page metadata:', { title, description });
        
        return () => {
          metaDescription.setAttribute('content', previousDescription || '');
          document.title = previousTitle;
        };
      }
    }
    
    logger.info('Updated page title:', { title });
    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
};