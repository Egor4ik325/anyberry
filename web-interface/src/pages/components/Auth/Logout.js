import React, { useState, useEffect } from "react";
import axios from "axios";
import { LOGOUT_URL } from "../../../api/constants";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

export default function Logout() {
    const [isLogout, setLogout] = useState(false);

    useEffect(() => {
        logout();
    }, [setLogout]);

    async function logout() {
        const csrftoken = Cookies.get("csrftoken");
        await axios.post(LOGOUT_URL, null, {
            withCredentials: true,
            headers: {
                "X-CSRFToken": csrftoken
            }
        })
        setLogout(true);
    }

    if (isLogout) {
        return <Redirect to="/" />
    }

    return (
        <div>
            Logout
        </div>
    );
}