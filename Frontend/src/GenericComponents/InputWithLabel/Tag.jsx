import React, { useState, useRef, useEffect } from "react";
import "./Tag.css"
import { FiMoreHorizontal } from "react-icons/fi";

const role = ['Owner', 'Admin', 'Writer', 'Reader']

function Tag({ text, userRole, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
          }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [menuRef]);

    const handleClick = (e) => {
        e.preventDefault()
        setIsMenuOpen(true)
    }

    return (
        <>
            <div className="px-0.5 transition ease-in-out tag-container">
                <div className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-myBlue rounded-full">
                    <label>{text}</label>
                    <FiMoreHorizontal className="tag-dropdown-menu-trigger" onClick={handleClick}/>
                </div>
                {isMenuOpen &&
                    <div ref={menuRef} className="custom-context-menu-tags">
                        {role.map((item) => {
                            console.log("🚀 ~ file: Tag.jsx:46 ~ {role.map ~ userRole", userRole)
                            console.log("🚀 ~ file: Tag.jsx:47 ~ {role.map ~ item", item)
                            return (
                                <p>{item}</p>
                            )
                        })}
                        <p>Remove</p>
                    </div>
                }
            </div>
        </>
    );
}

export default Tag;