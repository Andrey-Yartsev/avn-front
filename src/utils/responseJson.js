export default async response => {
  const response2 = response.clone();
  try {
    return await response.json();
  } catch (error) {
    const text = await response2.text();
    throw new Error(error.message + "; response: " + text);
  }
};
