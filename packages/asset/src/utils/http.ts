export const buildEndpoint = (protocol: "http" | "ws") => {
  const isSecureConnection = window.location.protocol === "https:";
  return `${isSecureConnection ? `${protocol}s` : protocol}://${
    window.location.host
  }/ws`;
};
