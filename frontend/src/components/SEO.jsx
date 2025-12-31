import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
    const location = useLocation();

    useEffect(() => {
        // Update Title
        const baseTitle = "Kharnak";
        document.title = title ? `${title} | ${baseTitle}` : baseTitle;

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || "Discover the essence of Ladakh with Kharnak. Curated tours, authentic Pashmina, and nomadic cultural experiences.");
        }

        // Update Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || "Ladakh, Leh, Changpa, Pashmina, Kharnak, Nomads, Winter Tourism");
        }

        // Update Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', `https://kharnak.in${location.pathname}`);

    }, [title, description, keywords, location.pathname]);

    return null; // This component doesn't render anything
};

export default SEO;
