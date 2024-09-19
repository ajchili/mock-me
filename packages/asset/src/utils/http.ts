export const buildEndpoint = (protocol: "http" | "ws") => {
  const isSecureConnection = window.location.protocol === "https:";
  const path = protocol === "http" ? "" : "/ws"
  return `${isSecureConnection ? `${protocol}s` : protocol}://${
    window.location.host
  }${path}`;
};
