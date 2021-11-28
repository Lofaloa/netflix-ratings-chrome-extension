module OpenMovieDatabaseAPI {

    class OpenMovieDatabaseQuery {

        constructor(
            private apiKey: string,
            private title: string,
            private year?: string
        ) { }

        toURLString = () => {
            const omdbURL = new URL("https://www.omdbapi.com");
            omdbURL.searchParams.append("apiKey", this.apiKey);
            omdbURL.searchParams.append("t", this.title);
            omdbURL.searchParams.append("type", "movie");
            if (this.year) {
                omdbURL.searchParams.append("y", this.year);
            }
            return omdbURL.toString();
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
            const query = new OpenMovieDatabaseQuery("<secret key>", title, year);
            const response = await fetch(query.toURLString());
            return handleOpenMovieDatabaseResponse(response);
        } catch (error) {
            console.error(error);
        }
    };


}