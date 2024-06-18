export function getLocalData(data) {
  return localStorage.getItem(data);
}
export function setLocalData(name, data) {
  localStorage.setItem(name, data);
}
