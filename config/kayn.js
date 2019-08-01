const { Kayn, REGIONS } = require("kayn");
const kayn = Kayn("RGAPI-5f3d70ee-7bf5-41d6-9aae-0e4547078f2d")({
  region: REGIONS.NORTH_AMERICA,
  locale: "en_US",
  debugOptions: {
    isEnabled: true,
    showKey: false
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
    shouldExitOn403: false
  },
  cacheOptions: {
    cache: null,
    timeToLives: {
      useDefault: false,
      byGroup: {},
      byMethod: {}
    }
  }
});
module.exports = kayn;
