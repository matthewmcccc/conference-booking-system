import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Link } from 'react-router-dom';

const LocationCard = (props) => {
    return (
        <Card className='max-w-sm pt-0'>
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
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.address}</CardDescription>
            </CardHeader>
            <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
                <Link to={`/locations/${props.id}`}>
                    <Button variant={'outline'} className="cursor-pointer">View Rooms</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default LocationCard;