import {Chip} from "@mui/material";
import {useContext, useEffect} from "react";
import Alert from "@mui/material/Alert";
import {MyContext} from "../App";


const OnlineChecker = () => {
    const {isOffline, updateIsOffline} = useContext(MyContext);
    function isOnline(){

        if (navigator.onLine){
            updateIsOffline(false);
        } else {
            updateIsOffline(true);
        }
    }

    window.addEventListener('offline', isOnline)
    window.addEventListener('online', isOnline)




    return(<div>

        {
            isOffline ?
                <Alert  variant="outlined" severity="warning">You are offline</Alert>:
                null
        }



    </div>)
}

export default OnlineChecker;