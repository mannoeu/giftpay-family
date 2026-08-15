export const AuthRoutes = {
  login: "/(public)/login",
  firstAccess: "/first-access",
  home: "/(private)/home",
};

export const buildLoginPayload = ({ cpf, password }) => ({
  username: String(cpf).replace(/\D/g, ""),
  password,
});

export const resolveInitialHref = ({
  isAuthenticated,
  isFirstAccess,
  pendingHref,
}) => {
  if (!isAuthenticated) return AuthRoutes.login;
  if (isFirstAccess) return AuthRoutes.firstAccess;
  return pendingHref ?? AuthRoutes.home;
};

export const resolveAuthRedirect = ({
  isAuthenticated,
  isFirstAccess,
  segments = [],
}) => {
  const root = segments[0];
  const inPrivate = root === "(private)";
  const inPublic = root === "(public)";
  const inFirstAccess = root === "first-access";

  if (!isAuthenticated) {
    if (inPrivate || inFirstAccess) return AuthRoutes.login;
    return null;
  }

  if (isFirstAccess) {
    if (!inFirstAccess) return AuthRoutes.firstAccess;
    return null;
  }

  if (inPublic || inFirstAccess || !root) return AuthRoutes.home;
  return null;
};
