import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Link } from 'react-router-dom';

const RoomCard = (props) => {
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
                        <p>Final Price (inc. heating/cooling adjustments): <br />£999</p>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardFooter className='gap-3max-sm:flex-col max-sm:items-stretch'>
                <Button className="cursor-pointer">
                    Confirm Booking
                </Button>
            </CardFooter>
        </Card>
    )
}
       
export default RoomCard;