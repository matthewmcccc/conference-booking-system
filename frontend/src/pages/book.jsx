import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import RoomCard from "@/components/roomCard";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function Booking() {
    const { user } = useAuth();
    const { roomid } = useParams();
    const [room, setRoom] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cost, setCost] = useState(0);
    const location = useLocation();
    const selectedDate = location.state?.date;

    useEffect(() => {
        const getRoomData = async () => {
            try {
                setLoading(true);
                const roomData = await api.get(`/api/rooms/${roomid}`);
                setRoom(roomData.data);
            } catch (err) {
                console.error("Failed to fetch room:", err);
            } finally {
                setLoading(false);
            }
        }

        getRoomData();
    }, [roomid]);

    useEffect(() => {
        if (!room || !selectedDate) return;

        const getBookingCost = async () => {
            try {
                const token = localStorage.getItem("token")
                setLoading(true)
                const costData = await api.get(`/api/bookings/calculate-price?roomId=${roomid}&date=${selectedDate}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setCost(costData.data.final_price)
            } catch (err) {
                console.error(`Couldn't fetch booking price data: ${err}`)
            } finally {
                setLoading(false);
            }
        }

        getBookingCost();
    }, [room, selectedDate]); 

    if (loading) return <div>Loading...</div>;
    if (!room) return <div>Room not found</div>;

    return (
        <div className="flex flex-col">
            <div className="text-center m-8 font-bold">
                Confirm your booking
                <hr className="w-1/2 mx-auto mt-8" />
            </div>
            <div className="flex justify-center items-center">
                <RoomCard 
                    image={"https://media.istockphoto.com/id/1400109086/photo/conference-room-with-blank-empty-tv-screen-monitor-mock-up-business-meeting-room-with-lcd.jpg?s=612x612&w=0&k=20&c=XR1Fr_L2nEFHzfCycEkIO5mObE1w-90MmUHI58f6KMc="}
                    name={room.name}
                    capacity={room.capacity}
                    base_price={room.base_price}
                    booking_date={selectedDate}
                    weather={weather}
                    final_price={cost}
                    room_id={room._id}
                />
            </div>
        </div>
    )
}