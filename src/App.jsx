import { useState } from 'react'
import './App.css'
import SearchInput from './components/SearchInput.jsx'
import CountryList from './components/CountryList.jsx'

function App() {
  const [searchText, setSearchText] = useState("")
  const [favorites, setFavorites] = useState([]) // aquí se guardan todos

  function toggleFavorite(country) {
    const alreadyIn = favorites.some(fav => fav.cca3 === country.cca3)
    if (alreadyIn) {
      setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3))
    } else {
      setFavorites([...favorites, country])
    }
  }

  return (
    <>
      <div> 
        <h3 style={{fontWeight: "bold"}}>COUNTRY SEARCH</h3>    
        <SearchInput 
          country={searchText} 
          function={(e) => setSearchText(e.target.value)}
        />
      </div>

      <CountryList 
        countryName={searchText}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}
export default App
