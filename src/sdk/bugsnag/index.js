let ErrorBoundary = ({ children }) => children;
let bugsnagClient = null;

export function initBugsnag() {
  if (__DEV__) return;

  const Bugsnag = require("@bugsnag/expo").default;
  Bugsnag.start({
    onError: () => true,
  });

  ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary();
  bugsnagClient = Bugsnag;
}

export { ErrorBoundary, bugsnagClient };
