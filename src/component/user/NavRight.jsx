import { Bell, Menu, X } from "lucide-react";
import { useMenuStore } from "../../store/useMenu";
import Logo from "../Logo";

const NavRight = () => {
  const { isOpen, toggleMenu } = useMenuStore();
  return (
    <div className="w-full min-h-24 sticky top-0 bg-[#fff]/80 backdrop-blur-md max-w-3xl p-4 flex items-center justify-between md:hidden z-40 transform mx-auto">
      {
        isOpen ? "" : <Logo />
      }
      <button className=" bg-main p-2 fixed right-4 top-7 rounded-md hover:bg-submain " onClick={toggleMenu}>
        {isOpen ? <X className="w-8 h-8 text-white" /> : <Menu className="w-8 h-8 text-white" />}
      </button>
    </div>);
};

export default NavRight;
