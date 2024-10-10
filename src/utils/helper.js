export const validEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let intials = "";

  for (let i = 0; i < 2; i++) {
    intials += words[i][0];
  }

  return intials.toUpperCase();
};
