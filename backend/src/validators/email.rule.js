const normalizeEmail = (email) => {
  if (typeof email !== "string") return null;

  const normalized = email.toLowerCase().trim();
  const regex = /^[a-z0-9]+@iiitsonepat\.ac\.in$/;

  return regex.test(normalized) ? normalized : null;
};

export default normalizeEmail;
