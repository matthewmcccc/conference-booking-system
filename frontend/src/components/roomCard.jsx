import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from "sonner"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

const RoomCard = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = async () => {
        if (!props.booking_date) {
            toast.error('Error', {
                description: "Please select a booking date first"
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post('/api/bookings', {
                room: props.room_id,
                date: props.booking_date
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            toast.success("Success!", {
                description: "Booking created successfully."
            })
        } catch (error) {
            console.error(`Booking error: ${error}`);
            toast.error("Booking Failed", {
                description: error.response?.data?.error || error.response?.data.message
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
         <Card className='max-w-lg pt-0'>
            {props.image ? (
                <CardContent className='px-0'>
                    <img
                    src={props.image}
                    alt='Banner'
                    className='aspect-video h-70 rounded-t-xl object-cover'
                    />
                </CardContent>
            ) : ''}
            <CardHeader>
                <CardTitle className="text-center">{props.name}</CardTitle>
                <CardDescription>
                    <div className="grid gap-2">
                        <p>Capacity: {props.capacity}</p>
                        <p>Base Price: £{props.base_price}</p>
                        <p>Booking Date: {props.booking_date ? new Date(props.booking_date).toLocaleDateString() : 'Not selected'}</p>
                    </div>
                    <hr className="mt-4" />
                    <div className="mt-4" >
                        <p>Final Price (inc. heating/cooling adjustments): <br />£{props.final_price}</p>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardFooter className='gap-3max-sm:flex-col max-sm:items-stretch'>
                <Button className="cursor-pointer" onClick={handleBooking} disabled={isLoading || !props.booking_date}>
                    {isLoading ? "Creating booking..." : "Confirm Booking"}
                </Button>
            </CardFooter>
        </Card>
    )
}
       
export default RoomCard;