import { whenDetailedVideoPreviewIsOpened } from "./events";
import { showVideoRatings } from "./ratings";

whenDetailedVideoPreviewIsOpened(showVideoRatings);

declare const OMDB_API_KEY: string | null;


console.log(OMDB_API_KEY);