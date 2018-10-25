import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

export default class Analytics {
  constructor() {
    this.tracker = new GoogleAnalyticsTracker("UA-126180021-1");
  }

  trackScreenView(strScreen) {
    if(process.env.NODE_ENV !== 'development') {
      this.tracker.trackScreenView(strScreen)
    }
  }

  trackEvent(strScreen, strEvent) {
    //if(process.env.NODE_ENV !== 'development') {
      this.tracker.trackEvent(strScreen, strEvent);
    //}
  }

}
