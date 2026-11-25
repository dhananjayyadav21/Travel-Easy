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
        ratePerKm: { type: Number, required: true, default: 8 },
        totalPrice: { type: Number, required: true },
        date: { type: String, required: true },

        status: {
            type: String,
            enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
            default: "Active",
        },

        paymentMethod: {
            type: String,
            enum: ['cash', 'online'],
            default: 'cash',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },

        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cancelledBy: {
            type: String,
        },
    },
    { timestamps: true }
);

// Indexes for common query patterns
bookingSchema.index({ bookedBy: 1, status: 1 });  // passenger's bookings by status
bookingSchema.index({ trip: 1 });                  // all bookings for a ride
bookingSchema.index({ createdAt: -1 });            // sort newest first

// Delete cached model in dev so schema changes take effect without full restart
if (process.env.NODE_ENV !== "production" && mongoose.models.Booking) {
    delete mongoose.models.Booking;
}

export default mongoose.model("Booking", bookingSchema);
