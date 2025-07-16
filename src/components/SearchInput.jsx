import React, { useState } from 'react'
import magnifyingGlass from '../assets/icons/magnifying-glass-solid.svg'

function SearchInput(props) {
    const [inputActivo, setInputActivo] = useState(false)

  return (
    <>
    <div className={inputActivo ? "inputActivo" : "searchInput"}>
        <input
            style={{
                outline: "none",
                margin: "5px 10px", 
                width: "60vw", 
                maxWidth: "60vw",
                background: "none", 
                border: "none",
                color: "black"
            }}
            placeholder='Enter country'
            value={props.country}
            onChange={props.function}
            onFocus={() => setInputActivo(true)}   // cuando entra el foco
            onBlur={() => setInputActivo(false)} 
        />
        <img 
           src={magnifyingGlass}
           className='icon' 
        />
    </div>
    </>
  )
}

export default SearchInput
