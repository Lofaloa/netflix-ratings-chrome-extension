function OpenMovieDatabaseQuery(apiKey, title, year = undefined, type = "movie") {
    this.apiKey = apiKey;
    this.title = title;
    this.year = year;
    this.toURLString = () => {
        const omdbURL = new URL("https://www.omdbapi.com");
        omdbURL.searchParams.append("apiKey", this.apiKey);
        omdbURL.searchParams.append("t", this.title);
        omdbURL.searchParams.append("type", type);
        if (year) {
            omdbURL.searchParams.append("y", this.year);
        }
        return omdbURL.toString();
    };
};

const handleOpenMovieDatabaseSuccess = async (jsonValue) => {
    let value = null;
    if (jsonValue.Response === "True") {
        value = jsonValue;
    }
    return Promise.resolve(value);
};

const handleOpenMovieDatabaseError = async (response) => {
    let message = "An error occured while trying to fetch a movie.";
    if (response.status === 401) {
        message = "The API key is invalid.";
    }
    return Promise.reject(message);
};

const handleOpenMovieDatabaseResponse = async (response) => {
    if (response.ok) {
        return handleOpenMovieDatabaseSuccess(await response.json());
    } else {
        return handleOpenMovieDatabaseError(response);
    }
};

const fetchMovieByTitleAndYear = async (title, year) => {
    try {
        const query = new OpenMovieDatabaseQuery("key", title, year);
        const response = await fetch(query.toURLString());
        return handleOpenMovieDatabaseResponse(response);
    } catch (error) {
        console.error(error);
    }
};