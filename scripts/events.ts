module NetflixInterfaceEvents {

    type EventHandler = () => void;

    const isDetailedVideoPreviewMutation = (mutation: any) => {
        const targetClasses = mutation.target.classList;
        return (
            mutation.type === "attributes" &&
            targetClasses.contains("lolomo") &&
            targetClasses.contains("is-fullbleed")
        );
    };

    const makeDetailedVideoPreviewEventHandler = (onOpened?: EventHandler, onClosed?: EventHandler) => {
        const handleDetailedVideoPreviewMutation = (mutation: any) => {
            if (mutation.target.classList.contains("has-open-jaw")) {
                if (onOpened) onOpened();
            } else {
                if (onClosed) onClosed();
            }
        };
        const handleDocumentBodyMutations = (mutations: any[]) => {
            mutations.forEach((mutation) => {
                if (isDetailedVideoPreviewMutation(mutation)) {
                    handleDetailedVideoPreviewMutation(mutation);
                }
            });
        };
        return () => {
            const observer = new MutationObserver(handleDocumentBodyMutations);
            const config = {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["class"],
                attributeOldValue: true,
            };
            observer.observe(document.body, config);
        };
    };

    export const whenDetailedVideoPreviewIsOpened = (onOpened: EventHandler) => {
        const handler = makeDetailedVideoPreviewEventHandler(onOpened, undefined);
        handler();
    };

}