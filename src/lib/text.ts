// Met en minuscules et enlève les accents : « Cafétéria » devient « cafeteria »
export function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Vrai si le texte contient la recherche, sans tenir compte des accents ni des majuscules
export function includesText(text: string, search: string) {
  return normalize(text).includes(normalize(search));
}
