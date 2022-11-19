import React from 'react'
import { GoSearch } from "react-icons/go"

const SearchBar = () => {
  return (
    <div className="input-group mt-2 mb-3">
        <input type="text" className="form-control" placeholder="Search..."/>
        <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
    </div>
    )
}

export default SearchBar