import { Menu, Wallet } from 'lucide-react'
import NavRight from './NavRight'
import SideNav from './SideNav'
import { useMenuStore } from '../../store/useMenu';

const Layout = ({ children }) => {
    const { isOpen } = useMenuStore();

    return (
        <>
            <NavRight />
            <div className='flex w-full h-auto md:h-screen'>


                <div className={ `duration-500 ease-in-out fixed md:static top-0 z-50 ${isOpen ? "left-0 " : "-left-full"}`}>
                    <SideNav />
                </div>
                <div className="flex-1 pt-12 px-4 md:px-8 overflow-y-auto">{children}</div>
            </div>
        </>
    )
}

export default Layout