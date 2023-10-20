import { useState } from 'react'

import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'

import logo from '../../images/logo.png'

const NavBarItem = ({ title, classProps }) => {
    return(
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    )
}


const NavBar = () =>{
    const [toggleMenu, setToggleMenu] = useState(false)
    return(
        <nav className='w-full flex md:justify-center justify-between'>
            <div className='md:flex-[0.5] flex-initial justify-center items-center -mt-3'>
                <img src={logo} alt="logo" className='w-32 h-28 cursor-pointer' />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial -mt-6">
                {["Market", "Exchange", "Tutorials", "Wallet"].map((item, index) => 
                    (
                        <NavBarItem key={item + index} title={item} />
                    )
                )}
                <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                    Login
                </li>
            </ul>
            <div className="flex relative">
                {toggleMenu 
                ? <AiOutlineClose fontSize={42} className="text-white md:hidden cursor-pointer mt-4 " onClick={()=>setToggleMenu(false)} />
                : <AiOutlineMenu fontSize={42} className="text-white md:hidden cursor-pointer mt-4 " onClick={()=>setToggleMenu(true)} />}
                {toggleMenu && (
                    <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                    flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={()=>setToggleMenu(false)} />
                        </li>
                        {["Market", "Exchange", "Tutorials", "Wallet"].map((item, index) => 
                            (
                                <NavBarItem key={item + index} title={item} classProps="my-2 text-lg" />
                            )
                        )}
                        <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                            Login
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    )
}
export default NavBar