// // const readVideoTitleFromPreviewDialogElement = (element) => {
// //     const videoTitleLogoElements = element.querySelectorAll("previewModal--player-titleTreatment-logo");
// //     if (videoTitleLogoElements.length > 0) {
// //         return videoTitleLogoElements[0].getAttribute("title");
// //     }
// //     return null;
// // };

// // const readYearFromPreviewDialogElement = (element) => {
// //     const yearDivElements = element.querySelectorAll(".previewModal--detailsMetadata-left .year");
// //     if (yearDivElements.length > 0) {
// //         return yearDivElements[0].innerText;
// //     }
// //     return null;
// // };

// // const readDataFromPreviewDialogElement = (element) => {
// //     return {
// //         title: readVideoTitleFromPreviewDialogElement(element),
// //         year: readYearFromPreviewDialogElement(element)
// //     };
// // }

const attemptToFindElementByClassName = (className) => {
    const matches = document.getElementsByClassName(className);
    let element = null;
    if (matches.length > 0) {
        element = matches[0];
    }
    return element;
};

// const onDetailedVideoPreviewDialogOpened = (handler) => {
//     const DETAILED_PREVIEW_DIALOG_CLASSNAME = "previewModal--container detail-modal";
//     const dialog = attemptToFindElementByClassName(DETAILED_PREVIEW_DIALOG_CLASSNAME);


//     console.log(dialog);
// };


const isDetailedVideoPreviewMutation = (mutation) => {
    const targetClasses = mutation.target.classList;
    return mutation.type === "attributes"
        && targetClasses.contains("lolomo")
        && targetClasses.contains("is-fullbleed");
};

const handleDetailedVideoPreviewMutation = (mutation) => {
    if (mutation.target.classList.contains("has-open-jaw")) {
        console.log("The detailed video preview is opened.", mutation);
    } else {
        console.log("The detailed video preview has been closed.", mutation);
    }
};

const handleDocumentBodyMutations = (mutations) => {
    mutations.forEach(mutation => {
        if (isDetailedVideoPreviewMutation(mutation)) {
            handleDetailedVideoPreviewMutation(mutation);
        }
    });
};

const mainViewNode = document.getElementsByClassName("mainView")[0];
const config = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [ "class" ],
    attributeOldValue: true
};

const observer = new MutationObserver(handleDocumentBodyMutations);
observer.observe(mainViewNode, config);


const setup = async () => {
    const value = await fetchMovieByTitleAndYear("Men in black", 1997);
    console.log(value);
};

setup();