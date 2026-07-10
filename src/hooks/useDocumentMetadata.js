import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page-specific HTML metadata for SEO optimization.
 * Updates document.title and meta-description content on component mount/update.
 * 
 * @param {string} title - Page title to display in browser tab
 * @param {string} description - Meta description content for search engine indexers
 */
const useDocumentMetadata = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = title.includes('AuraCRM') ? title : `${title} | AuraCRM`;
    }
    if (description) {
      const metaDescription = document.getElementById('meta-description');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
};

export default useDocumentMetadata;
