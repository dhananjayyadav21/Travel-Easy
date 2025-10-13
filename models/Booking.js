import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: false },

        source: { type: String, required: true },
        destination: { type: String, required: true },
        contact: { type: String, required: true },

        travelerName: { type: String, required: true },
        travelerNumber: { type: String, required: true },

        seatsBooked: { type: [String], required: true },
        numberOfSeats: { type: Number, required: true },

        kilometers: { type: Number, required: true },
        ratePerKm: { type: Number, required: true, default: 26 },
        totalPrice: { type: Number, required: true },
        date: { type: String, required: true },

        status: {
            type: String,
            enum: ['Active', 'Completed', 'Cancelled'],
            default: "Active",
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
