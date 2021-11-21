const findMainViewElement = () => {
    const mainViewElement = attemptToFindElementByClassName("mainView");
    if (mainViewElement === null) {
        console.error("Could not initialize the extension.");
    } else {
        return mainViewElement;
    }
};

const isDetailedVideoPreviewMutation = (mutation) => {
    const targetClasses = mutation.target.classList;
    return mutation.type === "attributes"
        && targetClasses.contains("lolomo")
        && targetClasses.contains("is-fullbleed");
};

const attemptToFindElementByClassName = (className) => {
    const matches = document.getElementsByClassName(className);
    let element = null;
    if (matches.length > 0) {
        element = matches[0];
    }
    return element;
};

const makeDetailedVideoPreviewEventHandler = (onOpened, onClosed) => {
    const handleDetailedVideoPreviewMutation = (mutation) => {
        if (mutation.target.classList.contains("has-open-jaw")) {
            if (onOpened) onOpened();
        } else {
            if (onClosed) onClosed();
        }
    };
    const handleDocumentBodyMutations = (mutations) => {
        mutations.forEach(mutation => {
            if (isDetailedVideoPreviewMutation(mutation)) {
                handleDetailedVideoPreviewMutation(mutation);
            }
        });
    };
    return () => {
        const observer = new MutationObserver(handleDocumentBodyMutations);
        const mainViewElement = findMainViewElement();
        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [ "class" ],
            attributeOldValue: true
        };
        observer.observe(mainViewElement, config);
    };
};

const whenDetailedVideoPreviewIsOpened = (onOpened) => {
    const handler = makeDetailedVideoPreviewEventHandler(onOpened, null);
    handler();
};