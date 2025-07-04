import mongoose, { Document, Schema } from 'mongoose';

// Define the EventStatus enum to match your class
enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

// Updated interface to match your Event class
export interface EventDocument extends Document {
    // From Actions base class
    title: string;
    description: string;
    createdBy: mongoose.Types.ObjectId; // User ID reference
    date: Date;
    
    // Event-specific fields
    location: string;
    speakers: Array<{
        name: string;
        details: string;
    }>;
    sponsors: Array<string>;
    timeline: Array<{
        time: string;
        details: string;
    }>;
    participants: Array<mongoose.Types.ObjectId>; // Array of User IDs
    eventForm: string;
    registrationDeadline: Date;
    maxParticipants: number;
    status: EventStatus;
    
    // Optional shareable link (if you still want this)
    shareableLink?: string;
}

// Updated schema to match your Event class
const eventSchema = new Schema<EventDocument>(
    {
        // From Actions base class
        title: { type: String, required: true },
        description: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        
        // Event-specific fields
        location: { type: String, required: true },
        speakers: [{
            name: { type: String, required: true },
            details: { type: String, required: true }
        }],
        sponsors: [{ type: String }],
        timeline: [{
            time: { type: String, required: true },
            details: { type: String, required: true }
        }],
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        eventForm: { type: String, required: true },
        registrationDeadline: { type: Date, required: true },
        maxParticipants: { type: Number, required: true },
        status: { 
            type: String, 
            enum: Object.values(EventStatus), 
            default: EventStatus.DRAFT 
        },
        
        // Optional field
        shareableLink: { type: String }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const EventModel = mongoose.model<EventDocument>('Event', eventSchema);
export default EventModel;