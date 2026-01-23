const isDev = process.env.NODE_ENV === "development";

export const devLog = (...args) => {
  if (isDev) {
    console.log(...args);
  }
};

export const devError = (...args) => {
  if (isDev) {
    console.error(...args);
  }
};
