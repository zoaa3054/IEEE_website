import Event from '../Actions/Event';
import User from '../Factory/User';
import EventModel from '../models/event.model';
import Head from '../Factory/Head';
import Chairman from '../Factory/Chairman';
import { APP_ORIGIN } from '../constants/env';
import { time } from 'console';

class EventService {
 static async createEvent(data: any, createdByUser: User) {
  // Only Head or Chairman can create events
  if (!(createdByUser instanceof Head || createdByUser instanceof Chairman)) {
    throw new Error('Unauthorized: Only Head or Chairman can create events');
  }
  
  const {
    title,
    description,
    date,
    location,
    speakers,
    sponsors,
    timeline,
    eventForm,
    registrationDeadline,
    maxParticipants,
    shareableLink,
    createdBy  // <-- Extract createdBy from data
  } = data;

  // Validate dates before creating the event
  const eventDate = new Date(date);
  const regDeadline = new Date(registrationDeadline);
  
  if (isNaN(eventDate.getTime())) {
    throw new Error('Invalid event date provided');
  }
  if (isNaN(regDeadline.getTime())) {
    throw new Error('Invalid registration deadline provided');
  }

  // Use the UserActions pattern for event creation
  const event = new Event(
    title,
    description,
    createdByUser,  // Pass the User object to the Event constructor
    eventDate,
    location,
    speakers || [],
    sponsors || [],
    timeline || [],
    [],
    eventForm,
    regDeadline,
    maxParticipants
  );

  // Prepare the document using only public getters
  const eventDocument = {
    title: event.getTitle(),
    description: event.getDescription(),
    date: event.getDate(),
    location: event.location,
    speakers: event.speakers,
    sponsors: event.sponsors,
    timeline: event.timeline,
    eventForm: event.getEventForm(),
    registrationDeadline: event.registrationDeadline,
    maxParticipants: event.maxParticipants,
    status: event.getStatus(),
    participants: event.getParticipants().map((user) => user.getId?.()?? null),
    createdBy: createdBy, // <-- Use the createdBy from the request data (string ID)
    shareableLink
  };

  const savedEvent = await EventModel.create(eventDocument);
  return savedEvent;
}

  static async editEvent(event: Event, user: User, updates: Partial<{
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
  }>) {
    // Validate dates in updates before processing
    if (updates.date && isNaN(new Date(updates.date).getTime())) {
      throw new Error('Invalid event date provided in updates');
    }
    if (updates.registrationDeadline && isNaN(new Date(updates.registrationDeadline).getTime())) {
      throw new Error('Invalid registration deadline provided in updates');
    }

    // Use the editEvent logic from UserActions
    event.editDetails(user, updates);
  
    // Prepare update data with validated dates
    const updateData: any = {
      title: event.getTitle(),
      description: event.getDescription(),
      date: event.getDate(),
      location: event.location,
      speakers: event.speakers,
      sponsors: event.sponsors,
      timeline: event.timeline,
      eventForm: event.getEventForm(),
      maxParticipants: event.maxParticipants,
      status: event.getStatus(),
      participants: event.getParticipants().map((user) => user.getId() ?? null),
    };

    // Only add registrationDeadline if it's valid
    const regDeadline = event.registrationDeadline;
    if (regDeadline && !isNaN(new Date(regDeadline).getTime())) {
      updateData.registrationDeadline = regDeadline;
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      event.getId?.(),
      updateData,
      { new: true }
    );
    return updatedEvent;
  }

  static async deleteEvent(event: Event, user: User) {
    event.deleteEvent(user);
    // Remove or mark as cancelled in the database
    const deletedEvent = await EventModel.findByIdAndUpdate(
      event.getId?.() ?? null,
      { status: event.getStatus() },
      { new: true }
    );
    return deletedEvent;
  }

  static async getEventById(eventId: string) {
    const eventDoc = await EventModel.findById(eventId);
    if (!eventDoc) {  
      throw new Error('Event not found');
    }
    const event = Event.fromDocument(eventDoc);
    return event;
  }

  static async addParticipant(event: Event, user: User) {
    if (!event.registerParticipant(user)) {
      throw new Error('Failed to register participant');
    }
  
    const updatedEvent = await EventModel.findByIdAndUpdate(
      event.getId?.() ?? null,
      { participants: event.getParticipants().map((u) => u.getId?.() ?? null) },
      { new: true }
    );
    
    return updatedEvent;
  }

  static async getEvents(): Promise<Event[]> {
    return Event.getEvents();
  }

  // Helper method to validate date strings
  private static isValidDate(dateString: string | Date): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}

export default EventService;