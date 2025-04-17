import React, { isValidElement, useEffect } from "react";
import {useSearchParams} from "react-router-dom"
import PhoneAuth from "./components/auth/PhoneAuth";

export function AccountabilityPartnerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get("name");
    const penaltyAmount = searchParams.get("penaltyAmount");
    const userId = searchParams.get("userId");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
        
    return (
        <main>
            {(userId && name && penaltyAmount) ? (
                <>
            <div>
                <h2>Your friend {name} wants you to be an accountability partner.</h2>
                <p>Input your phone number to be notified when they succeed or fail.</p>
                <p>If they fail, they'll owe you ${penaltyAmount}</p>
            </div>
        <PhoneAuth
        mode="partner"
        userId={userId}
        setIsAuthenticated={() => {}}
        />
        </>
    ) : (
        <p>alert(Oops! Your friend has missing data. Let them know and make sure that they have they've fully completed signing up for One Habit.)</p>
    )}
    
        </main> 
    )

}