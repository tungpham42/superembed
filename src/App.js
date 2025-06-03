function App() {
  const query = window.location.search || "";
  window.location.href = `/.netlify/functions/getPlayerUrl${query}`;
  return null;
}

export default App;
