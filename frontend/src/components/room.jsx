import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "./datePicker";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Room({ room }) {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

   const handleBookNow = () => {
        if (selectedDate) {
            const formattedDate = selectedDate instanceof Date 
                ? selectedDate.toISOString().split('T')[0]
                : selectedDate;
            
            navigate(`/book/${room._id}`, { state: { date: formattedDate } });
        }
    };

    return (
        <div className="grid grid-cols-3 my-12">
            <div className="col-span-1">
                <img
                    src="https://media.istockphoto.com/id/1400109086/photo/conference-room-with-blank-empty-tv-screen-monitor-mock-up-business-meeting-room-with-lcd.jpg?s=612x612&w=0&k=20&c=XR1Fr_L2nEFHzfCycEkIO5mObE1w-90MmUHI58f6KMc="
                    className="w-100 rounded-md" 
                />
            </div>
            <div className="col-span-2 flex flex-col justify-between">
                <div>
                    <h1 className="text-xl font-bold">
                        {room.name}
                    </h1>
                    <div className="my-auto">
                        <p>
                            Capacity: {room.capacity}
                        </p>
                        <p>
                            Base Price: £{room.base_price}/day
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <DatePicker date={selectedDate} setDate={setSelectedDate} />
                    {user ? (
                        <Button 
                            className="cursor-pointer self-start"
                            onClick={handleBookNow}
                            disabled={!selectedDate}
                        >
                            Book Now
                        </Button>
                    ) : (
                        <Button className="self-start cursor-not-allowed" disabled>
                            Book Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}