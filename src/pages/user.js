import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useContext} from "react";
import {MyContext} from "../App";

const UserPage = ()=>{

    const location = useLocation();
    const auth = location.state?.auth;

    const {isAuth, updateIsAuth} = useContext(MyContext);
    const navigate = useNavigate()

    const { t} = useTranslation();

    const userID = location.state?.id;

    if (!isAuth){
        return <Navigate to='/money-manager/login' />;
    }

    return(<div className={'container'}>
        <h1>
            <a onClick={() => navigate(-1)}>
                ⬅️
            </a>
            Hola
        </h1>
        <h1>
            {userID}
        </h1>

        <button className="btn1" onClick={() => {
            updateIsAuth(false)
            navigate('/money-manager/login');

        }}>
            {t("Log out")}
        </button>

    </div>)
}

export default UserPage;