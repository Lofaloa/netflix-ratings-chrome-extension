/// <reference path="references.ts" />
module Ratings {

    const INTERNET_MOVIE_DATABASE = {
        sourceName: "Internet Movie Database",
        iconURL: "assets/imdb_logo.svg",
        iconAlt: "IMDb Icon",
        title: "Open the Internet Movie Database in a new tab.",
        open: (imdbId: string) => {
            if (window != null) {
                // window.open(`https://www.imdb.com/title/${imdbId}`, "_blank").focus();
            }
        },
    };

    const ROTTEN_TOMATOES = {
        sourceName: "Rotten Tomatoes",
        iconURL: "assets/rotten_tomatoes_logo.png",
        iconAlt: "Rotten Tomatoes Icon",
        title: "Open Rotten Tomatoes in a new tab.",
    };

    const METACRITIC = {
        sourceName: "Metacritic",
        iconURL: "assets/metacritic_logo.svg",
        iconAlt: "Metacritic Icon",
        title: "Open Metacritic in a new tab.",
    };

    const ROW_ELEMENT_STYLE =
        "display: flex; flex-direction: row; gap: .5em; align-items: center;";

    const readTitleFromDetailedVideoPreview = () => {
        const videoTitleLogoElements = document.getElementsByClassName(
            "previewModal--player-titleTreatment-logo"
        );
        if (videoTitleLogoElements.length > 0) {
            return videoTitleLogoElements[0].getAttribute("alt");
        }
        return null;
    };

    const readYearFromDetailedVideoPreview = () => {
        let yearDivElements: NodeListOf<HTMLDivElement> = document.querySelectorAll(
            ".previewModal--detailsMetadata-left .year"
        );
        if (yearDivElements.length > 0) {
            return yearDivElements[0].innerText;
        }
        yearDivElements = document.querySelectorAll(
            "videoMetadata--second-line .year"
        );
        if (yearDivElements.length > 0) {
            return yearDivElements[0].innerText;
        }
        return null;
    };

    const hasDetailedVideoPreviewAnEpisodesSelector = () => {
        const episodeSelectLabelElements =
            document.getElementsByClassName("episodeSelector");
        return episodeSelectLabelElements.length > 0;
    };

    const hasDetailedVideoPreviewEpisodeDetails = () => {
        const episodeSelectLabelElements = document.getElementsByClassName(
            "previewModal-episodeDetails"
        );
        return episodeSelectLabelElements.length > 0;
    };

    const readTypeFromDetailedVideoPreview = () => {
        let type = "movie";
        if (hasDetailedVideoPreviewAnEpisodesSelector()) {
            type = "series";
        }
        return type;
    };

    const makeRatingIconElement = (logoURLString: string, alt: string) => {
        const ratingIconElement: any = document.createElement("img");
        ratingIconElement.src = chrome.runtime.getURL(logoURLString);
        ratingIconElement.alt = alt;
        ratingIconElement.style = "height: 1em;";
        return ratingIconElement;
    };

    const makeRatingValueElement = (value: string) => {
        const ratingValueElement = document.createElement("span");
        ratingValueElement.innerHTML = value;
        return ratingValueElement;
    };

    const makeRatingElement = (rating: any, videoMetadata: any, sourceWebsite: any) => {
        const ratingElement = document.createElement("span");
        const ratingIcon = makeRatingIconElement(
            sourceWebsite.iconURL,
            sourceWebsite.iconAlt
        );
        const ratingValue = makeRatingValueElement(rating.Value);
        ratingElement.appendChild(ratingIcon);
        ratingElement.appendChild(ratingValue);
        ratingElement.setAttribute("style", ROW_ELEMENT_STYLE + " cursor: pointer;");

        if (sourceWebsite.open) {
            ratingElement.title = sourceWebsite.title;
            ratingElement.addEventListener("click", () => {
                sourceWebsite.open(videoMetadata.imdbID);
            });
        }

        return ratingElement;
    };

    const makeRatingElementFor = (rating: any, videoMetadata: any) => {
        let sourceWebsite = null;
        switch (rating.Source) {
            case INTERNET_MOVIE_DATABASE.sourceName:
                sourceWebsite = INTERNET_MOVIE_DATABASE;
                break;
            case ROTTEN_TOMATOES.sourceName:
                sourceWebsite = ROTTEN_TOMATOES;
                break;
            case METACRITIC.sourceName:
                sourceWebsite = METACRITIC;
                break;
        }
        return makeRatingElement(rating, videoMetadata, sourceWebsite);
    };

    const appendRatingsToVideoMetadata = (metadata: any) => {
        const videoMetadata = document.getElementsByClassName(
            "videoMetadata--container"
        );
        if (videoMetadata.length > 0 && metadata.Ratings.length > 0) {
            const thirdLine: any = document.createElement("div");
            thirdLine.style = ROW_ELEMENT_STYLE;
            metadata.Ratings.forEach((rating: any) => {
                thirdLine.appendChild(makeRatingElementFor(rating, metadata));
            });
            videoMetadata[0].appendChild(thirdLine);
        }
    };

    export const showVideoRatings = async () => {
        const videoTitle = readTitleFromDetailedVideoPreview();
        let releaseYear = readYearFromDetailedVideoPreview();
        if (videoTitle !== null && releaseYear !== null) {
            const value = await OpenMovieDatabaseAPI.fetchMovieByTitleAndYear(videoTitle, releaseYear);
            if (value !== null) {
                appendRatingsToVideoMetadata(value);
            }
        }
    };

}