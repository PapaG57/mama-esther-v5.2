export async function checkExternalUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Erreur réseau :", error);
    return false;
  }
}
