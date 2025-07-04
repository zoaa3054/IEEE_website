import User from'../Factory/User';
import Actions from './Actions';
import Head from '../Factory/Head';
import Chairman from '../Factory/Chairman';
import { hasPermission, withPermission } from './UserActions';
import EventModel from '../models/event.model';

enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}
class Event extends Actions {
    protected id?: string; // Optional ID for database reference
    public location: string;
    public speakers: Array<{name: string, details: string}>; // name, speaker details 
    public sponsors: Array<string>; // list of sponsors
    public timeline: Array<{time: string, details: string}>; // time, event details
    public participants: Array<User>; // list of participants
    private eventForm: string; 
    public registrationDeadline: Date;
    public maxParticipants: number;
    private status: EventStatus;

    constructor(
        title: string, 
        description: string, 
        createdBy: User, 
        date: Date, 
        location: string,
        speakers: Array<{name: string, details: string}>, 
        sponsors: Array<string>, 
        timeline: Array<{time: string, details: string}>,
        participants: Array<User>, 
        eventForm: string, 
        registrationDeadline: Date, 
        maxParticipants: number
    ) {
        super(title, description, createdBy, date);
        this.location = location;
        this.speakers = speakers || [];
        this.sponsors = sponsors;
        this.timeline = timeline || [];
        this.participants = participants;
        this.eventForm = eventForm;
        this.registrationDeadline = registrationDeadline;
        this.maxParticipants = maxParticipants;
        this.status = EventStatus.DRAFT; // Only set once
    }

    public registerParticipant(user: User): boolean {
        if (new Date() > this.registrationDeadline) {
            throw new Error("Registration deadline has passed");
        }

        // Check if event is published
        if (this.status !== EventStatus.PUBLISHED) {
            throw new Error("Cannot register for unpublished event");
        }
        
        // Check capacity
        if (this.maxParticipants && this.participants.length >= this.maxParticipants) {
            throw new Error("Event has reached maximum capacity");
        }
        
        if (this.participants.includes(user)) {
            throw new Error("User already registered for this event");
        }
        
        this.participants.push(user);
        console.log(`User ${user.getName()} successfully registered for event: ${this.title}`);
        return true;
    }

   
   public editDetails = withPermission((
    user: User,
    updates: Partial<{
        title: string;
        description: string;
        location: string;
        date: Date;
        registrationDeadline: Date;
        speakers: Array<{name: string, details: string}>; // Changed from Map to Array
        sponsors: Array<string>;
        maxParticipants: number;
        eventForm: string; // Changed from any to string
        timeline: Array<{ time: string; details: string }>;
    }>
): void => {
    // Handle basic field updates
    if (updates.title) this.title = updates.title;
    if (updates.description) this.description = updates.description;
    if (updates.location) this.location = updates.location;
    if (updates.date) {
        const newDate = new Date(updates.date);
        if (isNaN(newDate.getTime())) {
            throw new Error("Invalid date provided");
        }
        this.date = newDate;
    }
    
    if (updates.registrationDeadline) {
        const newDeadline = new Date(updates.registrationDeadline);
        if (isNaN(newDeadline.getTime())) {
            throw new Error("Invalid registration deadline provided");
        }
        this.registrationDeadline = newDeadline;
    }
    if (updates.maxParticipants) this.maxParticipants = updates.maxParticipants;
    if (updates.eventForm) this.setEventForm(updates.eventForm);
    
    // Handle speakers - toggle add/remove based on existence
    if (updates.speakers) {
        updates.speakers.forEach(({ name, details }) => {
            // Find existing speaker by name
            const existingSpeakerIndex = this.speakers.findIndex(speaker => speaker.name === name);
            
            if (existingSpeakerIndex > -1) {
                // Speaker exists, remove them
                this.speakers.splice(existingSpeakerIndex, 1);
                console.log(`Speaker "${name}" removed from event "${this.title}"`);
            } else {
                // Speaker doesn't exist, add them
                this.speakers.push({ name, details });
                console.log(`Speaker "${name}" added to event "${this.title}"`);
            }
        });
    }
    
    // Handle sponsors - toggle add/remove based on existence
    if (updates.sponsors) {
        updates.sponsors.forEach(sponsor => {
            const existingIndex = this.sponsors.indexOf(sponsor);
            if (existingIndex > -1) {
                // Sponsor exists, remove them
                this.sponsors.splice(existingIndex, 1);
                console.log(`Sponsor "${sponsor}" removed from event "${this.title}"`);
            } else {
                // Sponsor doesn't exist, add them
                this.sponsors.push(sponsor);
                console.log(`Sponsor "${sponsor}" added to event "${this.title}"`);
            }
        });
    }
    
    // Handle timeline - toggle add/remove based on existence
    if (updates.timeline) {
        updates.timeline.forEach(({ time, details }) => {
            // Check if timeline item already exists
            if (this.timeline.some(item => item.time === time)) {
                // Remove existing item
                this.timeline = this.timeline.filter(item => item.time !== time);
                console.log(`Timeline item at "${time}" removed from event "${this.title}"`);
            } else {
                // Add new timeline item
                this.timeline.push({ time, details });
                console.log(`Timeline item added at "${time}" to event "${this.title}"`);
            }
        });
    }
    
    console.log(`Event "${this.title}" has been updated by ${user.getName()}`);
});

    // Fixed deleteEvent method using withPermission wrapper
    public deleteEvent = withPermission((user: User): boolean => {
        this.status = EventStatus.CANCELLED;
        
        // Notify all participants
        // observer pattern implementation can go here
        
        console.log(`Event "${this.title}" has been deleted by ${user.getName()}`);
        return true;
    });
 
    public setEventForm(form: string): void {
        this.eventForm = form;
    }

    public getEventForm(): string {
        return this.eventForm;
    }

    public getStatus(): EventStatus {
        return this.status;
    }

    public getParticipants(): Array<User> {
        return [...this.participants]; // Return a copy to prevent direct manipulation
    }
    
    public getId() : string | undefined {
        return this.id;
    }
    
    static fromDocument(doc: any): Event  {
        // Helper to filter out Mongoose internal keys
        const filterMap = (obj: any) =>
            Object.entries(obj || {})
                .filter(([key]) => !key.startsWith('$'))
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, any>);

        const event = new Event(
            doc.title,
            doc.description,
            doc.createdBy,
            new Date(doc.date),
            doc.location,
            doc.speakers || [],
            doc.sponsors || [],
            doc.timeline || [],
            doc.participants || [],
            doc.eventForm,
            new Date(doc.registrationDeadline),
            doc.maxParticipants
        );
        event.id = doc._id?.toString();
        return event;
    }
 
    public static async getEvents(): Promise<Array<Event>> {
        try {
            // Fetch all events from database
            const events = await EventModel.find({}).lean().exec();
            return events.map((eventDoc: any) => Event.fromDocument(eventDoc));
        } catch (error) {
            console.error("Error fetching events:", error);
            throw new Error("Failed to fetch events");
        }
    }
}

export default Event;