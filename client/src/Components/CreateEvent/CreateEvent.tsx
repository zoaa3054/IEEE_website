import React, { useState } from 'react';
import './CreateEvent.css';
import { useAuth } from '../../AuthContext';

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear + i);
};

const GUEST_FIELDS = ['name', 'email', 'committee'] as const;
const SPEAKER_FIELDS = ['name', 'email', 'phoneNumber'] as const;
interface TimelineEvent {
  time: string;
  details: string;
}
// const SPEAKER_FIELDS = [] as const;

const GOOGLE_FORM_TYPES = [
  { value: 'text', label: 'Short answer' },
  { value: 'textarea', label: 'Paragraph' },
  { value: 'radio', label: 'Multiple choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'file', label: 'File upload' },
  { value: 'scale', label: 'Linear scale' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
];

type GuestField = typeof GUEST_FIELDS[number];
type SpeakerField = typeof SPEAKER_FIELDS[number];

type CustomField = {
  title: string;
  type: string;
  value: any;
  required: true;
};

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <div className="access-denied">You must be signed in to create an event.</div>;
  }
  const [guestFields, setGuestFields] = useState<Record<GuestField, boolean>>({ name: true, email: true, committee: true });
  const [guestValues, setGuestValues] = useState<Record<GuestField, string>>({ name: '', email: '', committee: '' });
  const [guestCustomFields, setGuestCustomFields] = useState<CustomField[]>([]);
  const [guestCustomChecked, setGuestCustomChecked] = useState<boolean[]>([]);

  const [speakerFields, setSpeakerFields] = useState<Record<SpeakerField, boolean>>({ name: true, email: true, phoneNumber: true });
  const [speakerValues, setSpeakerValues] = useState<Record<SpeakerField, string>>({ name: '', email: '', phoneNumber: ''});
  const [speakerCustomFields, setSpeakerCustomFields] = useState<CustomField[]>([]);
  const [speakerCustomChecked, setSpeakerCustomChecked] = useState<boolean[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<'guest' | 'speaker' | null>(null);
  const [modalFieldName, setModalFieldName] = useState('');
  const [modalFieldType, setModalFieldType] = useState('text');

  // Date state
  const [startDate, setStartDate] = useState({ day: '', month: '', year: '' });
  const [expirationDate, setExpirationDate] = useState({ day: '', month: '', year: '' });

  // Event data fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [sponsors, setSponsors] = useState('');
  const [speackers, setSpeackers] = useState('');
  const [timeline, setTimeline] = useState('[]');
  const [isThereSpeackersForm, setIsThereSpeackersForm] = useState(false);
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [status, setStatus] = useState('DRAFT');

  // Access control
  if (user.role !== 'Head' && user.role !== 'Chairman') {
    return <div className="access-denied">Access denied. Only Heads and Chairmen can create events.</div>;
  }

  // Compute dynamic event status
  let dynamicStatus = status;
  let statusLabel = '';
  let statusClass = '';
  const today = new Date();
  const expDate = expirationDate.year && expirationDate.month && expirationDate.day
    ? new Date(`${expirationDate.year}-${expirationDate.month}-${expirationDate.day}`)
    : null;

  if (status === 'PUBLISHED') {
    dynamicStatus = 'PUBLISHED';
    statusLabel = 'Published';
    statusClass = 'event-status-published';
  } else if (expDate && today > expDate) {
    dynamicStatus = 'COMPLETED';
    statusLabel = 'Completed';
    statusClass = 'event-status-completed';
  } else if (status === 'DRAFT') {
    dynamicStatus = 'DRAFT';
    statusLabel = 'Draft';
    statusClass = 'event-status-draft';
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Compose event data
    // Convert start and end date dropdowns to ISO strings
    const eventStarts = startDate.year && startDate.month && startDate.day
      ? new Date(`${startDate.year}-${startDate.month}-${startDate.day}`).toISOString()
      : '';
    const eventEnds = expirationDate.year && expirationDate.month && expirationDate.day
      ? new Date(`${expirationDate.year}-${expirationDate.month}-${expirationDate.day}`).toISOString()
      : '';

    // Prepare guest and speaker fields (enabled only)
    const enabledGuestFields = [
      ...GUEST_FIELDS.filter(f => guestFields[f]),
      ...guestCustomFields.filter((_, idx) => guestCustomChecked[idx]).map(f => ({ title: f.title, type: f.type }))
    ];
    const enabledSpeakerFields = [
      // ...SPEAKER_FIELDS.filter(f => speakerFields[f]),
      ...speakerCustomFields.filter((_, idx) => speakerCustomChecked[idx]).map(f => ({ title: f.title, type: f.type }))
    ];

    const eventData = {
      title,
      description,
      createdBy: user._id,
      date: eventStarts,
      // eventEnds,
      location,
      sponsors: sponsors.split(',').map(s => s.trim()).filter(Boolean),
      // participants: [], // New event, so empty
      speakers: speackers.split(',').map(s => s.trim()).filter(Boolean), // No speakers yet
      timeline: JSON.parse(timeline) as TimelineEvent[], // No timeline yet
      registrationDeadline,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
      status: dynamicStatus, // Use computed status
      // userId: user._id,
      // guestFields: enabledGuestFields,
      speakersFormFields: enabledSpeakerFields,
      // No eventForm field
    };
    console.log('Submitting event data:', eventData);
    try {
      const res = await fetch('http://localhost:8081/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('PUBLISHED');
        alert('Event created successfully!');
        // Optionally redirect or reset form
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Validation for required fields
  const isFormValid = () => {
    return (
      title.trim() &&
      description.trim() &&
      startDate.day && startDate.month && startDate.year &&
      // expirationDate.day && expirationDate.month && expirationDate.year &&
      location.trim() &&
      sponsors.trim() &&
      // speackers.trim() &&
      registrationDeadline &&
      maxParticipants !== '' && Number(maxParticipants) > 0
    );
  };

  const handleToggle = (section: 'guest' | 'speaker', field: string) => {
    if (section === 'guest') setGuestFields((prev) => ({ ...prev, [field]: !prev[field as GuestField] }));
    else setSpeakerFields((prev) => ({ ...prev, [field]: !prev[field as SpeakerField] }));
  };

  const handleValueChange = (section: 'guest' | 'speaker', field: string, value: string) => {
    if (section === 'guest') setGuestValues((prev) => ({ ...prev, [field]: value }));
    else setSpeakerValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>, field: 'day' | 'month' | 'year', value: string) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  // Modal logic
  const openModal = (section: 'guest' | 'speaker') => {
    setModalSection(section);
    setModalFieldName('');
    setModalFieldType('text');
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalSection(null);
    setModalFieldName('');
    setModalFieldType('text');
  };
  const handleModalConfirm = () => {
    if (!modalFieldName.trim()) return;
    const newField: CustomField = { title: modalFieldName.trim(), type: modalFieldType, value: '', required: true };
    if (modalSection === 'guest') {
      setGuestCustomFields((prev) => [...prev, newField]);
      setGuestCustomChecked((prev) => [...prev, true]);
    } else if (modalSection === 'speaker') {
      setSpeakerCustomFields((prev) => [...prev, newField]);
      setSpeakerCustomChecked((prev) => [...prev, true]);
    }
    closeModal();
  };
  const handleCustomFieldChange = (section: 'guest' | 'speaker', idx: number, value: any) => {
    if (section === 'guest') setGuestCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, value } : f));
    else setSpeakerCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, value } : f));
  };
  const handleCustomCheckedChange = (section: 'guest' | 'speaker', idx: number) => {
    if (section === 'guest') setGuestCustomChecked((prev) => prev.map((v, i) => i === idx ? !v : v));
    else setSpeakerCustomChecked((prev) => prev.map((v, i) => i === idx ? !v : v));
  };

  // Render input by type
  const renderCustomInput = (field: CustomField, section: 'guest' | 'speaker', idx: number) => {
    switch (field.type) {
      case 'text':
        return <input className="toggle-input" type="text" placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'textarea':
        return <textarea className="toggle-input" placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'radio':
        return <input className="toggle-input" type="text" placeholder={`Options for ${field.title} (comma separated)`} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'checkbox':
        return <input className="toggle-input" type="text" placeholder={`Options for ${field.title} (comma separated)`} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'dropdown':
        return <input className="toggle-input" type="text" placeholder={`Options for ${field.title} (comma separated)`} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'file':
        return <input className="toggle-input" type="file" onChange={e => handleCustomFieldChange(section, idx, e.target.files?.[0] || '')} />;
      case 'scale':
        return <input className="toggle-input" type="number" min={1} max={10} placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'date':
        return <input className="toggle-input" type="date" placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      case 'time':
        return <input className="toggle-input" type="time" placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
      default:
        return <input className="toggle-input" type="text" placeholder={field.title} value={field.value} onChange={e => handleCustomFieldChange(section, idx, e.target.value)} />;
    }
  };

  return (
    <div className="createevent-container">
      <form className="createevent-form" onSubmit={handleSubmit}>
        <div className="form-section-header">
          <span>Event Data</span>
        </div>
        {/* Dynamic Event Status Display */}
        <div className={`event-status-label ${statusClass}`}>{statusLabel}</div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Event Date</label>
            <div className="date-dropdowns">
              <select className="date-select" value={startDate.day} onChange={e => setStartDate(prev => ({ ...prev, day: e.target.value }))}>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}</option>
                ))}
              </select>
              <select className="date-select" value={startDate.month} onChange={e => setStartDate(prev => ({ ...prev, month: e.target.value }))}>
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}</option>
                ))}
              </select>
              <select className="date-select" value={startDate.year} onChange={e => setStartDate(prev => ({ ...prev, year: e.target.value }))}>
                <option value="">Year</option>
                {getYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className="form-group">
            <label>Event Ends</label>
            <div className="date-dropdowns">
              <select className="date-select" value={expirationDate.day} onChange={e => setExpirationDate(prev => ({ ...prev, day: e.target.value }))}>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}</option>
                ))}
              </select>
              <select className="date-select" value={expirationDate.month} onChange={e => setExpirationDate(prev => ({ ...prev, month: e.target.value }))}>
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={String(i+1).padStart(2, '0')}>{i+1}</option>
                ))}
              </select>
              <select className="date-select" value={expirationDate.year} onChange={e => setExpirationDate(prev => ({ ...prev, year: e.target.value }))}>
                <option value="">Year</option>
                {getYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div> */}
        </div>
        <div className="form-group">
          <label>Event Timeline</label>
          <div>
            <button
              type="button"
              className="add-field-btn"
              onClick={() => {
                // Parse timeline or start new
                let arr: { time: string; details: string }[] = [];
                try {
                  arr = timeline ? JSON.parse(timeline) : [];
                } catch {
                  arr = [];
                }
                arr.push({ time: '', details: '' });
                setTimeline(JSON.stringify(arr));
              }}
            >
              Add Timeline Slot
            </button>
          </div>
          {/* Timeline slots input */}
          {(() => {
            let arr: { time: string; details: string }[] = [];
            try {
              arr = timeline ? JSON.parse(timeline) : [];
            } catch {
              arr = [];
            }
            return arr.map((slot, idx) => (
              <div key={idx} className="timeline-slot-row">
                <input
                  type="time"
                  value={slot.time}
                  onChange={e => {
                    const newArr = [...arr];
                    newArr[idx].time = e.target.value;
                    setTimeline(JSON.stringify(newArr));
                  }}
                  className="timeline-time-input"
                />
                <input
                  type="text"
                  placeholder="Details"
                  value={slot.details}
                  onChange={e => {
                    const newArr = [...arr];
                    newArr[idx].details = e.target.value;
                    setTimeline(JSON.stringify(newArr));
                  }}
                  className="timeline-details-input"
                />
                <button
                  type="button"
                  className="remove-slot-btn"
                  onClick={() => {
                    const newArr = arr.filter((_, i) => i !== idx);
                    setTimeline(JSON.stringify(newArr));
                  }}
                  title="Remove slot"
                >
                  &times;
                </button>
              </div>
            ));
          })()}
          {/* Visual timeline preview */}
          <div className="timeline-visual">
            <h4>Timeline Preview</h4>
            <ul>
              {(() => {
                let arr: { time: string; details: string }[] = [];
                try {
                  arr = timeline ? JSON.parse(timeline) : [];
                } catch {
                  arr = [];
                }
                return arr.length === 0 ? (
                  <li style={{ color: '#888' }}>No timeline slots added yet.</li>
                ) : (
                  arr.map((slot, idx) => (
                    <li key={idx}>
                      <strong>{slot.time || '--:--'}</strong> &mdash; {slot.details || <span style={{ color: '#aaa' }}>No details</span>}
                    </li>
                  ))
                );
              })()}
            </ul>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="sponsors">Sponsors (comma separated)</label>
          <input id="sponsors" name="sponsors" value={sponsors} onChange={e => setSponsors(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="speackers">Speakers (comma separated)
            <small>
              &nbsp;&nbsp;Add a registration form&nbsp;&nbsp;
              <input type="checkbox" checked={isThereSpeackersForm} onChange={() => setIsThereSpeackersForm(!isThereSpeackersForm)} />
            </small>
          </label>
          <input id="speackers" name="speackers" value={speackers} onChange={e => setSpeackers(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="registrationDeadline">Registration Deadline</label>
          <input id="registrationDeadline" name="registrationDeadline" type="date" value={registrationDeadline} onChange={e => setRegistrationDeadline(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="maxParticipants">Max Participants</label>
          <input
            id="maxParticipants"
            name="maxParticipants"
            type="number"
            min="0"
            value={maxParticipants}
            onChange={e => {
              const val = e.target.value;
              if (val === '' || Number(val) >= 0) setMaxParticipants(val);
              else setMaxParticipants('0');
            }}
          />
        </div>
        {/* <hr className="form-divider" />
        <div className="form-section">
          <h3 className="form-section-title">Registration Fields for Guests</h3>
          {GUEST_FIELDS.map((field) => (
            <div className="toggle-row" key={field}>
              <label>{`Include ${field.charAt(0).toUpperCase() + field.slice(1)} Field`}</label>
              <input type="checkbox" checked={guestFields[field]} onChange={() => handleToggle('guest', field)} />
            </div>
          ))}
          {guestCustomFields.map((field, idx) => (
            <div className="toggle-row" key={field.title + idx}>
              <label>{field.title}</label>
              <input type="checkbox" checked={guestCustomChecked[idx]} onChange={() => handleCustomCheckedChange('guest', idx)} />
            </div>
          ))}
          <button type="button" className="add-field-btn" onClick={() => openModal('guest')}>Add New Field</button>
        </div> */}

        {isThereSpeackersForm && (
        <hr className="form-divider" />)}
        {isThereSpeackersForm && (
        <div className="form-section">
          <h3 className="form-section-title">Registration Fields for Speakers</h3>
          {SPEAKER_FIELDS.map((field) => (
            <div className="toggle-row" key={field}>
              <label>{`${field.charAt(0).toUpperCase() + field.slice(1)} Field is Default`}</label>
              <input type="checkbox" disabled checked={speakerFields[field]} onChange={() => handleToggle('speaker', field)} />
            </div>
          ))}
          
          {speakerCustomFields.map((field, idx) => (
            <div className="toggle-row" key={field.title + idx}>
              <label>{field.title}</label>
              <input type="checkbox" checked={speakerCustomChecked[idx]} onChange={() => handleCustomCheckedChange('speaker', idx)} />
            </div>
          ))}
          <button type="button" className="add-field-btn" onClick={() => openModal('speaker')}>Add New Field</button>
        </div>)}
        <div className="form-actions-row">
          <button type="button" className="update-btn">Update Event</button>
          <button
            type="button"
            className="publish-btn"
            disabled={!isFormValid()}
            onClick={() => {
              // setStatus('PUBLISHED');
              setTimeout(() => {
                document.querySelector('.createevent-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
              }, 0);
            }}
          >
            Publish Event
          </button>
        </div>
      </form>
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Field</h3>
            <div className="modal-form-group">
              <label>Field Name</label>
              <input type="text" value={modalFieldName} onChange={e => setModalFieldName(e.target.value)} />
            </div>
            <div className="modal-form-group">
              <label>Data Type</label>
              <select value={modalFieldType} onChange={e => setModalFieldType(e.target.value)}>
                {GOOGLE_FORM_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="update-btn">Cancel</button>
              <button type="button" onClick={handleModalConfirm} className="publish-btn">Add Field</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
