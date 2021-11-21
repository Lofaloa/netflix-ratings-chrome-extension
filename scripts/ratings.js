const readTitleFromDetailedVideoPreview = () => {
    const videoTitleLogoElements = document.getElementsByClassName("previewModal--player-titleTreatment-logo");
    if (videoTitleLogoElements.length > 0) {
        return videoTitleLogoElements[0].getAttribute("alt");
    }
    return null;
};

const readYearFromDetailedVideoPreview = () => {
    let yearDivElements = document.querySelectorAll(".previewModal--detailsMetadata-left .year");
    if (yearDivElements.length > 0) {
        return yearDivElements[0].innerText;
    }
    yearDivElements = document.querySelectorAll("videoMetadata--second-line .year");
    if (yearDivElements.length > 0) {
        return yearDivElements[0].innerText;
    }
    return null;
};

const hasDetailedVideoPreviewAnEpisodesSelector = () => {
    const episodeSelectLabelElements = document.getElementsByClassName("episodeSelector");
    return episodeSelectLabelElements.length > 0;
};

const hasDetailedVideoPreviewEpisodeDetails = () => {
    const episodeSelectLabelElements = document.getElementsByClassName("previewModal-episodeDetails");
    return episodeSelectLabelElements.length > 0;
};

const readTypeFromDetailedVideoPreview = () => {
    let type = "movie";
    if (hasDetailedVideoPreviewAnEpisodesSelector()) {
        type = "series";
    }
    return type;
};

const makeRatingIconElement = (logoURLString, alt) => {
    const ratingIconElement = document.createElement("img");
    ratingIconElement.src = chrome.runtime.getURL(logoURLString);
    ratingIconElement.alt = alt;
    ratingIconElement.style = "height: 1em;";
    return ratingIconElement;
};

const makeRatingValueElement = (value) => {
    const ratingValueElement = document.createElement("span");
    ratingValueElement.innerHTML = value;
    return ratingValueElement;
};

const makeRatingElement = (logoURLString, alt, value) => {
    const rating = document.createElement("span");
    const ratingIcon = makeRatingIconElement(logoURLString, alt);
    const ratingValue = makeRatingValueElement(value);
    rating.appendChild(ratingIcon);
    rating.appendChild(ratingValue);
    rating.style = "display: flex; flex-direction: row; gap: .5em; align-items: center;";
    return rating;
};

const makeRatingElementFor = (rating) => {
    let ratingElement = null;
    if (rating.Source === "Internet Movie Database") {
        ratingElement = makeRatingElement("assets/imdb_logo.svg", "IMDb Logo", rating.Value);
    } else if (rating.Source === "Rotten Tomatoes") {
        ratingElement = makeRatingElement("assets/rotten_tomatoes_logo.png", "Rotten Tomatoes Logo", rating.Value);
    } else if (rating.Source === "Metacritic") {
        ratingElement = makeRatingElement("assets/metacritic_logo.svg", "Metacritic Logo", rating.Value);
    }
    return ratingElement;
};

const appendRatingsToVideoMetadata = (metadata) => {
    const elements = document.getElementsByClassName("videoMetadata--container");


    if (metadata.Ratings.length > 0) {

        const thirdLine = document.createElement("div");
        thirdLine.className = "videoMetaData--third-line";
        
        thirdLine.style = "display: flex; flex-direction: row; gap: .5em; align-items: center;";

        metadata.Ratings.forEach(rating => {
            thirdLine.appendChild(makeRatingElementFor(rating));
        });

        if (elements.length > 0) {
            elements[0].appendChild(thirdLine);
        }

    }

};

const showVideoRatings = async () => {
    const videoTitle = readTitleFromDetailedVideoPreview();
    let releaseYear = readYearFromDetailedVideoPreview();

    console.log("Info are title is '", videoTitle, "' and year is '", releaseYear, ".");

    if (videoTitle !== null && releaseYear !== null) {
        console.log("About to request medata data to OMDB...");

        const value = await fetchMovieByTitleAndYear(videoTitle, releaseYear);
    
        if (value === null) {
            console.log("No metadata was found for ", videoTitle);
        } else {
            appendRatingsToVideoMetadata(value);
        }
    
    } else {
        console.error("Failed to parse information from the preview.");
    }

};

