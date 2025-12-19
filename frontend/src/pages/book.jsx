import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import RoomCard from "@/components/roomCard";

export default function Booking() {
    const { roomid } = useParams();
    const [room, setRoom] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const selectedDate = location.state?.date;

    useEffect(() => {
        const getRoomData = async () => {
            try {
                setLoading(true);
                const roomData = await axios.get(`/api/rooms/${roomid}`);
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

        const getWeatherData = async () => {
            try {
                const dateStr = new Date(selectedDate).toISOString().split('T')[0];
                const weatherData = await axios.get(
                    `/api/weather/forecast?locationId=${room.location}&date=${dateStr}`
                );
                setWeather(weatherData.data);
                console.log(weatherData.data);
            } catch (err) {
                console.error("Failed to fetch weather data:", err);
            }
        }

        getWeatherData();
    }, [room, selectedDate]); 

    if (loading) return <div>Loading...</div>;
    if (!room) return <div>Room not found</div>;

    return (
        <div className="flex flex-col">
            {console.log(room.location)}
            <div className="flex justify-center items-center">
                <RoomCard 
                    image={"https://media.istockphoto.com/id/1400109086/photo/conference-room-with-blank-empty-tv-screen-monitor-mock-up-business-meeting-room-with-lcd.jpg?s=612x612&w=0&k=20&c=XR1Fr_L2nEFHzfCycEkIO5mObE1w-90MmUHI58f6KMc="}
                    name={room.name}
                    capacity={room.capacity}
                    base_price={room.base_price}
                    booking_date={selectedDate}
                    weather={weather}
                />
            </div>
        </div>
    )
}