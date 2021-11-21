# Netflix Ratings Chrome Extension
## About
This is a simple Google Chrome extension that adds external ratings to the Netflix interface.

The ratings are made available by the [Open Movie Database](http://www.omdbapi.com/). Depending on the movie, the API has multiple possible sources:

- [The Internat Movie Database (IMDb)](https://www.imdb.com/);
- [Rottent tomatoes](https://www.rottentomatoes.com/);
- [Metacritic](https://www.metacritic.com/);

![Screenshot](assets/screenshot.gif)

## Installation
### Development
If you want to install it locally, you need to update the [Open Movie Database](http://www.omdbapi.com/) in the source code. First, you need to request one [here](http://www.omdbapi.com/apikey.aspx). Once you have it, edit the `scripts/api.js` file at line 43.

```js
const query = new OpenMovieDatabaseQuery("<secret-key>", title, year);
```

Browse to `chrome://extensions/`, activate the developer mode and click the *Load unpacked* button. Select the project root directory in the file explorer. The extension should be loaded succesfully.

You can start working.