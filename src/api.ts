declare const OMDB_HOST: string | null;
declare const OMDB_API_KEY: string | null;

class OpenMovieDatabaseQuery {

    constructor(
        private apiKey: string,
        private title: string,
        private year?: string
    ) { }

    toURLString = () => {
        if (OMDB_HOST === null) {
            return null;
        } else {
            const omdbURL = new URL(OMDB_HOST);
            omdbURL.searchParams.append("apiKey", this.apiKey);
            omdbURL.searchParams.append("t", this.title);
            omdbURL.searchParams.append("type", "movie");
            if (this.year) {
                omdbURL.searchParams.append("y", this.year);
            }
            return omdbURL.toString();
        }
    };
}

const handleOpenMovieDatabaseSuccess = async (jsonValue: any) => {
    let value = null;
    if (jsonValue.Response === "True") {
        value = jsonValue;
    }
    return Promise.resolve(value);
};

const handleOpenMovieDatabaseError = async (response: Response) => {
    let message = "An error occured while trying to fetch a movie.";
    if (response.status === 401) {
        message = "The API key is invalid.";
    }
    return Promise.reject(message);
};

const handleOpenMovieDatabaseResponse = async (response: Response) => {
    if (response.ok) {
        return handleOpenMovieDatabaseSuccess(await response.json());
    } else {
        return handleOpenMovieDatabaseError(response);
    }
};

export const fetchMovieByTitleAndYear = async (title: string, year: string): Promise<any> => {
    try {
        if (OMDB_API_KEY === null) {
            console.error("Could not resolve the OMDB API key.");
            return null;
        } else {
            const query = new OpenMovieDatabaseQuery(OMDB_API_KEY, title, year);
            const url = query.toURLString();
            if (url === null) {
                console.error("Could not resolved the OMDB host.");
                return null;
            } else {
                const response = await fetch(url);
                return handleOpenMovieDatabaseResponse(response);
            }
        }
    } catch (error) {
        console.error(error);
    }
};