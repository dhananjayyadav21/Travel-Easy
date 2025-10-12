const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, 'Trip must be linked to a creator.']
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active',
        required: [true, 'Trip status is required.']
    },

    // 1. Basic Ride Information
    name: {
        type: String,
        required: [true, 'Trip name is required.'],
        trim: true,
        maxlength: [100, 'Trip name cannot be more than 100 characters.']
    },
    seats: {
        type: Number,
        required: [true, 'Available seats are required.'],
        min: [1, 'Must offer at least 1 seat.'],
    },
    date: {

        type: String,
        required: [true, 'Departure date is required.'],
    },
    time: {

        type: String,
        required: [true, 'Departure time is required.'],
    },
    meetPlace: {
        type: String,
        required: [true, 'Meeting point is required.'],
        trim: true
    },

    // 2. Route Details
    source: {
        type: String,
        required: [true, 'Source location is required.'],
        trim: true,
    },
    destination: {
        type: String,
        required: [true, 'Destination location is required.'],
        trim: true,
    },
    kilometer: {
        type: Number,
        required: [true, 'Kilometer distance is required.'],
        min: [1, 'Distance must be at least 1 kilometer.']
    },

    // 3. Provider and Vehicle Details (Sensitive Data)
    contact: {
        type: String,
        required: [true, 'Contact number is required.'],
        match: [/^\d{10,15}$/, 'Please enter a valid contact number.'],
        trim: true,
    },
    vehicle: {
        type: String,
        required: [true, 'Vehicle number is required.'],
        uppercase: true,
        trim: true
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle Type is required.'],
        uppercase: true,
        trim: true
    },
    panCard: {
        type: String,
        required: [true, 'PAN Card number is required for verification.'],
        uppercase: true,
        trim: true
    },

    // Optional: Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
