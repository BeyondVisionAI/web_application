import React, { useState, useRef, useEffect } from "react";
import "./Tag.css"
import { FiMoreHorizontal } from "react-icons/fi";

const ROLE_LIST = ['OWNER', 'ADMIN', 'WRITE', 'READ']

function Tag({ text, role, userRole, isUser, onDelete, onChangeRole }) {
    console.log("🚀 ~ file: Tag.jsx:8 ~ role", role)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [canBeEdited, setCanBeEdited] = useState(true)
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

    useEffect(() => {
        if (role === 'OWNER') setCanBeEdited(false);
        if (['WRITE', 'READ'].includes(userRole)) setCanBeEdited(false)
        if (isUser) setCanBeEdited(false)
    }, [role, userRole]);

    const handleClick = (e) => {
        e.preventDefault()
        setIsMenuOpen(true)
    }

    const handleSelect = (type) => {
        if (type === 'DELETE') {
            onDelete();
        } else {
            onChangeRole(type);
        }
        setIsMenuOpen(false);
    }
    console.log("🚀 ~ file: Tag.jsx:48 ~ Tag ~ role", role)

    return (
        <>
            <div className="px-0.5 transition ease-in-out tag-container">
                <div className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-myBlue rounded-full">
                    <label style={{textTransform: 'capitalize'}}>{text}</label>
                    {canBeEdited && <FiMoreHorizontal className="tag-dropdown-menu-trigger" onClick={handleClick}/>}
                </div>
                {isMenuOpen &&
                    <div ref={menuRef} className="custom-context-menu-tags">
                        {ROLE_LIST.map((item) => {
                            if (item === 'OWNER') return null;
                            return (
                                <p onClick={() => handleSelect(item)} className={`${item === role && 'active'}`}>{item.toLocaleLowerCase()}</p>
                            )
                        })}
                        <p onClick={() => handleSelect('DELETE')} className="remove">Remove</p>
                    </div>
                }
            </div>
        </>
    );
}

export default Tag;