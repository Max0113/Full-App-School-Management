import React from 'react'

function ButtonPr({text}) {
  return (
    <button type="button" className="text-md p-4 px-5 bg-blue-500  font-bold text-white rounded-md hover:bg-white hover:text-blue-500 hover:border-0 transition-all duration-300">{text}</button>
  )
}

export default ButtonPr;
