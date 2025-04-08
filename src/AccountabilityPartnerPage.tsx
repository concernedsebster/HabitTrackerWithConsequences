import React from "react";
import {useSearchParams} from "react-router-dom"
import PhoneAuth from "./components/auth/PhoneAuth";

export function AccountabilityPartnerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    return (
        <>
            {userId ? (
            <PhoneAuth
            mode="partner"
            userId={userId}
            setIsAuthenticated={() => {}}
            />
        ) : (
            <p>alert(Missing user ID. Please check your link.)</p>
        )
        }
        </>
    )

}