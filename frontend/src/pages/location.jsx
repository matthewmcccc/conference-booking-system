import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Room from "@/components/room";

export default function Location() {
    const { id } = useParams();
    const [rooms, setRooms] = useState([]);
    const [location, setLocation] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [locationRes, roomRes] = await Promise.all([
                axios.get(`/api/locations/${id}`),
                axios.get(`/api/locations/${id}/rooms`)
            ])
            setRooms(roomRes.data);
            setLocation(locationRes.data);
        }

        fetchData();
    }, [])

    return (
        <main className="m-6 w-full">
            <h1>{location.city} Conference Rooms</h1>
            <div className="">
                {
                    rooms.map((room) => {
                        console.log(room);
                        return (
                            <Room key={room._id} room={room} />
                        )
                    })
                }
            </div>
        </main>
    )
}