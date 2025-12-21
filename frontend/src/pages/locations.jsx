import { useEffect, useState } from "react"
import axios from "axios";
import LocationCard from "@/components/locationCard";
import api from "@/lib/axios";

export default function Locations() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const getLocations = async () => {
            const res = await api.get("/api/locations");
            const locationData = res.data;
            setLocations(locationData);
        }

        getLocations();
    }, [])

    return (
        <main className="m-6 w-full">
            {console.log(locations)}
            <div className="mx-auto">
                <h1 className="text-lg font-bold">Locations</h1>    
            </div>
            <div className="my-8 grid grid-cols-3 gap-6">
                {locations.map((location) => {
                    return (
                        <LocationCard 
                            image="https://media.istockphoto.com/id/1400109086/photo/conference-room-with-blank-empty-tv-screen-monitor-mock-up-business-meeting-room-with-lcd.jpg?s=612x612&w=0&k=20&c=XR1Fr_L2nEFHzfCycEkIO5mObE1w-90MmUHI58f6KMc="
                            title={location.city}
                            id={location._id}
                            address={`${location.address}, ${location.postcode}`}
                        />
                    )
                })}
            </div>
        </main>
    )
}