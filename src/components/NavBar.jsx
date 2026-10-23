import { useState } from "react";
import pokeball from "../assets/pokeball.webp"
import { MdOutlineSearch, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaBars } from "react-icons/fa6";

export default function NavBar(props) {
    const [darkMode, setDarkMode] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    function searchPokemon(event) {
        props.onSearchChange(event.target.value)
    }

    return (
        <nav className="navbar">
            <div className="navbar-mobile">
                <a href="#">
                    <img src={pokeball} alt="" />
                    <h1>Pokédex</h1>
                </a>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="navbar"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    <FaBars size={20}/>
                </button>
            </div>

            <ul className={`navbar-links ${isOpen ? "open" : "close"}`} id="navbar">
                <li><a href="#">Home</a></li>
                <li><a href="#">Favorites</a></li>
            </ul>

            <div className="navbar-controls">
                <form role="search">
                    <MdOutlineSearch
                        className="search-icon"
                        size="1.3em"
                        aria-hidden={true}
                    />
                    <input
                        aria-label="Input to search a Pokemon by name or id"
                        type="search"
                        placeholder="Bulbasaur..."
                        value={props.search}
                        onChange={searchPokemon}
                    />
                </form>
                <button
                    type="button"
                    className="theme-button"
                    aria-label={darkMode ? "Enable light mode" : "Enable dark mode"}
                >
                    {
                        darkMode ?
                            <MdOutlineLightMode size="1.7em" /> :
                            <MdOutlineDarkMode size="1.7em" />
                    }
                </button>
            </div>
        </nav>
    )
}
