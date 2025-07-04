import Event from './Event';
import User from '../Factory/User';
import Head from '../Factory/Head';
import Chairman from '../Factory/Chairman';

function hasPermission(user: User): boolean {
  return user instanceof Head || user instanceof Chairman;
}

function withPermission<T extends (...args: any[]) => any>(
  fn: (user: User, ...args: Parameters<T>) => ReturnType<T>
): (user: User, ...args: Parameters<T>) => ReturnType<T> {
  return (user, ...args) => {
    if (!hasPermission(user)) {
       const err = new Error(`Permission denied: ${user.constructor.name} cannot perform this action`);
      err.name = 'UnauthorizedError';
      throw err;
    }
    return fn(user, ...args);
  };
}

class UserActions {
    // EVENT ACTIONS
    public createEvent = withPermission((
        user: User,
        title: string,
        description: string,
        date: Date,
        location: string,
        speakers: Array<{ name: string; details: string }> = [],
        sponsors: Array<string> = [],
        timeline: Array<{ time: string; details: string }> = [],
        eventForm: string = '',
        registrationDeadline: Date,
        maxParticipants: number
     ): Event => {
        const event = new Event(
            title, description, user, date, location, speakers, sponsors,
            timeline, [], eventForm, registrationDeadline, maxParticipants
        );
                
        console.log(`Event "${title}" created by ${user.getName()}`);
        return event;
    });

    public editEvent = withPermission((
        user: User,
        event: Event,
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
            timeline: Array<{time: string, details: string}>; // Added timeline
        }>
    ): void => {
        event.editDetails(user, updates); // Fixed: pass updates object directly
        console.log(`Event "${event.getTitle()}" edited by ${user.getName()}`);
    });

    public deleteEvent = withPermission((user: User, event: Event): boolean => {
        const result = event.deleteEvent(user);
        console.log(`Event "${event.getTitle()}" deleted by ${user.getName()}`);
        return result;
    });

    public getEvents = async (): Promise<Event[]> => {
        try {
            // Assuming we have a database connection and EventModel is defined
            const events = await Event.getEvents();
            return events;
        } catch (error) {
            console.error("Error fetching events:", error);
            throw new Error("Failed to fetch events");
        }
    }
}

export default UserActions;
export { hasPermission, withPermission };