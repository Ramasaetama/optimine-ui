/**
 * OptiMine SPA - URL Parser Utility
 */

export const UrlParser = {
    /**
     * Parse current URL hash
     * @returns {Object} { resource, id, verb }
     */
    parseActiveUrl() {
        const hash = window.location.hash.slice(1).toLowerCase();
        return this.parseUrl(hash);
    },

    /**
     * Parse URL string
     * @param {string} url 
     * @returns {Object}
     */
    parseUrl(url) {
        const urlSegments = url.split('/');
        
        return {
            resource: urlSegments[0] || null,
            id: urlSegments[1] || null,
            verb: urlSegments[2] || null
        };
    },

    /**
     * Parse query string from URL
     * @param {string} url 
     * @returns {Object}
     */
    parseQuery(url) {
        const queryString = url.split('?')[1];
        if (!queryString) return {};
        
        const params = {};
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        
        return params;
    },

    /**
     * Build URL with query params
     * @param {string} base 
     * @param {Object} params 
     * @returns {string}
     */
    buildUrl(base, params = {}) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        return queryString ? `${base}?${queryString}` : base;
    }
};
