import React, { useState, useEffect } from "react";
import axios from "axios";
import { LOGOUT_URL } from "../../Constants";

export default function Logout() {
    const [isLogout, setLogout] = useState(false);

    useEffect(() => {
        logout();
    }, [setLogout]);

    function logout() {
        axios.post(LOGOUT_URL, null, {
            withCredentials: true
        })
    }

    return (
        <div>
            Logout
        </div>
    );
}