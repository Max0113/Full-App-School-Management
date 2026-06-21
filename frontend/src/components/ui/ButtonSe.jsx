import React from 'react'

function ButtonSe({text}) {
  return (
    <button type="button" className="text-md p-4 px-5 bg-white border-1 font-bold text-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:border-1 transition-all duration-300">{text}</button>
  )
}

export default ButtonSe;
