import { findKeywords } from "./fetchKeyword";
import { getCharacterInspiration } from "./getCharacterInspiration";
import { getRandomName } from "./getRandomName";
import { getWeather } from "./weather";

import { getSuggestShows } from "./suggestShows";


export default {
  getWeather: getWeather,
  findKeywords: findKeywords,
  getRandomName: getRandomName,
  getCharacterInspiration: getCharacterInspiration,

  suggestShows: getSuggestShows,
};
