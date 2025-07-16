import React, { useState, useEffect } from 'react'
import Favorites from './Favorites'
import startSolid from '../assets/icons/star-solid.svg'
import startSolidYellow from '../assets/icons/star-solid_Yellow.svg'

function CountryList({ countryName, favorites, onToggleFavorite }) {
  const [results, setResults] = useState([])
  const [error, setError] = useState("")
  const [displayCountry, setDisplayCountry] = useState([])

  useEffect(() => {
    if (countryName.trim().length < 2) {
      setResults([])
      return
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Country not found")
        }
        return response.json()
      })
      .then(data => {
        setResults(data)
        setError("")
      })
      .catch(err => {
        setError(err.message)
        setResults([])
      })
  }, [countryName])

  return (
    <>
      {/* Vista detallada de país */}
      {displayCountry && displayCountry.name && (
        <div className="detail-card">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>
              {displayCountry.name.common}
            </h2>
            <img
              src={displayCountry.flags.png}
              alt={displayCountry.name.common}
              width="150"
            />
          </div>
          <div>
            <p><strong>Capital:</strong> {displayCountry.capital?.[0]}</p>
            <p><strong>Population:</strong> {displayCountry.population.toLocaleString()}</p>
            <p><strong>Region:</strong> {displayCountry.region}</p>
          </div>
          <button onClick={() => setDisplayCountry([])}>Close</button>
        </div>
      )}

      {/* Lista de resultados */}
      <div className="container">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {results.map((item) => {
          const isFavorite = favorites.some(fav => fav.cca3 === item.cca3)

          return (
            <div
              key={item.cca3}
              className='cards'
              onClick={() => setDisplayCountry(item)}
            >
              <Favorites
                icon={isFavorite ? startSolidYellow : startSolid}
                paisFavorito={item}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(item)
                }}
              />

              <div>
                <h3 className='countryName'>{item.name.common}</h3>
                <p className='contryCapital'>Capital: {item.capital?.[0]}</p>
              </div>

              <img
                className='flag'
                src={item.flags.png}
                alt={item.name.common}
                width="100"
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default CountryList