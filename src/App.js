function App() {
  window.location.href = `/.netlify/functions/getPlayerUrl${window.location.search}`;
  return null;
}

export default App;
