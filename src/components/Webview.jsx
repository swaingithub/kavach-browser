import React, { useEffect, memo } from 'react';

const Webview = memo(React.forwardRef(({ tab, onUpdate }, ref) => {
    useEffect(() => {
        const webview = ref.current;
        if (!webview) return;

        let loadingTimeout;

        const handlePageTitleUpdated = (e) => onUpdate(tab.id, { title: e.title });
        const handlePageFaviconUpdated = (e) => e.favicons.length > 0 && onUpdate(tab.id, { favicon: e.favicons[0] });
        const handleDidNavigate = (e) => onUpdate(tab.id, { url: e.url });
        const handleDidStartLoading = () => {
            onUpdate(tab.id, { isLoading: true });
            clearTimeout(loadingTimeout);
            loadingTimeout = setTimeout(() => {
                if (!ref.current) return;
                try {
                    if (typeof ref.current.isLoading === 'function' ? ref.current.isLoading() : true) {
                        ref.current.stop();
                    }
                } catch (_) {}
                onUpdate(tab.id, {
                    isLoading: false,
                    canGoBack: webview.canGoBack(),
                    canGoForward: webview.canGoForward()
                });
            }, 20000);
        };
        const settleLoading = () => {
            if (ref.current) {
                onUpdate(tab.id, { 
                    isLoading: false, 
                    canGoBack: webview.canGoBack(), 
                    canGoForward: webview.canGoForward() 
                });
            }
            clearTimeout(loadingTimeout);
        };
        const handleDidStopLoading = () => settleLoading();
        const handleDidFinishLoad = () => settleLoading();
        const handleDidFrameFinishLoad = () => settleLoading();
        const handleDidFailLoad = () => settleLoading();
        const handleDidNavigateInPage = () => settleLoading();

        webview.addEventListener('page-title-updated', handlePageTitleUpdated);
        webview.addEventListener('page-favicon-updated', handlePageFaviconUpdated);
        webview.addEventListener('did-navigate', handleDidNavigate);
        webview.addEventListener('did-start-loading', handleDidStartLoading);
        webview.addEventListener('did-stop-loading', handleDidStopLoading);
        webview.addEventListener('did-finish-load', handleDidFinishLoad);
        webview.addEventListener('did-fail-load', handleDidFailLoad);
        webview.addEventListener('dom-ready', handleDidFinishLoad);
        webview.addEventListener('did-frame-finish-load', handleDidFrameFinishLoad);
        webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);

        return () => {
            webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
            webview.removeEventListener('page-favicon-updated', handlePageFaviconUpdated);
            webview.removeEventListener('did-navigate', handleDidNavigate);
            webview.removeEventListener('did-start-loading', handleDidStartLoading);
            webview.removeEventListener('did-stop-loading', handleDidStopLoading);
            webview.removeEventListener('did-finish-load', handleDidFinishLoad);
            webview.removeEventListener('did-fail-load', handleDidFailLoad);
            webview.removeEventListener('dom-ready', handleDidFinishLoad);
            webview.removeEventListener('did-frame-finish-load', handleDidFrameFinishLoad);
            webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
            clearTimeout(loadingTimeout);
        };
    }, [tab.id, onUpdate, ref]);

    return (
        <webview ref={ref}
                 src={tab.url}
                 useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
                 webpreferences="contextIsolation=true, nodeIntegration=false" />
    );
}));

export default Webview;


