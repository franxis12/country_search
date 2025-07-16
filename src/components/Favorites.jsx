import React from 'react'
import { useState } from 'react'

function Favorites({ icon, onClick }) {
  return (
    <div>
      <img
        src={icon}
        className="icon"
        onClick={onClick}
        alt="favorite"
      />
    </div>
  )
}

export default Favorites
