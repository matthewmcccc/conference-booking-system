import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function UserHomepage() {
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchUserBookings = async () => {
            try {
                setLoading(true);
                const userId = user._id;
                const token = localStorage.getItem("token");
                
                const res = await axios.get(`/api/bookings/${userId}`, {
                   headers: {
                    "Authorization": `Bearer ${token}`
                   }
                });
                
                console.log("Bookings response:", res.data);
                setUserBookings(res.data.bookings || res.data);
            } catch (error) {
                console.log(`Error fetching user bookings:`, error);
                toast.error("Error fetching user bookings", {
                    description: error.response?.data?.message || error.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, [user]);

    useEffect(() => {
        if (user === null) {
            navigate("/");
            toast.error("You need to be logged in to access this page.");
        }
    }, [user, navigate]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            {userBookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="grid gap-4">
                    {userBookings.map((booking) => (
                        <div key={booking._id} className="border p-4 rounded">
                            <p>Booking ID: {booking._id}</p>
                            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p>Price: £{booking.total_price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}