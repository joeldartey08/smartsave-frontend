import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/useAuthStore";
import { LoaderCircle } from "lucide-react";
import api from "../../services/api";
import SideNav from "../../component/user/SideNav";
import Layout from "../../component/user/Layout";

const Balance = () => {
    const { token, user, setUser } = useAuthstore();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        const fetctUser = async () => {
            setLoading(true);
            try {
                const response = await api.get("/user/profile");
                console.log(response);

                if (response.status === true || response.status === 200) {
                    setData(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetctUser();
    }, []);

    useEffect(() => {
        setUser(data);
    }, [data]);



    if (loading || !user) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <div className="max-w-xs h-64">
                    <LoaderCircle className="w-16 h-16 text-main animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <>
          <Layout>
        
    
          </Layout>
        </>
      );
};

export default Balance;
