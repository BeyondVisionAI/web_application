import AccountButton from "../../Auth/AccountButton";
import NavBar from "../NavBar";

export default function NavBarVariante({ input, updateInput }) {
    const searchBar = (
        <div className="input-search-container" key='searchBar'>
            <input className="input-search" placeholder="Recherchez un projet..." value={input} onChange={event => updateInput(event.target.value)} />
            <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-6" fill="none" viewBox="0 0 24 24" stroke="#7793ED">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    );

  return (
    <NavBar
        homeRef='home'
        others={[searchBar, AccountButton()]}
    />
  )
}
