# UML DIAGRAMS
## EduMeet: Faculty Availability & Appointment System

---

## 1. INTRODUCTION TO UML

### What is UML?
UML (Unified Modeling Language) is a standard visual language used to model software systems. It helps in understanding, designing, and documenting software systems through diagrams.

### Types of UML Diagrams
1. **Structural Diagrams:** Show static structure (Class Diagram)
2. **Behavioral Diagrams:** Show dynamic behavior (Use Case, Sequence, Activity)

---

## 2. USE CASE DIAGRAM

### Purpose
Shows the interaction between users (actors) and the system. It represents what the system does from the user's perspective.

### Actors
1. **Student:** Books appointments, views status
2. **Faculty:** Manages availability, approves/rejects appointments
3. **Admin:** Manages users and monitors system

### Use Case Diagram

```
                    EduMeet System
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │   ┌──────────────┐                             │
    │   │   Register   │                             │
    │   └──────────────┘                             │
    │          ↑                                      │
    │          │                                      │
┌─────────┐   │   ┌──────────────┐                   │
│         │───┼───│    Login     │                   │
│ Student │   │   └──────────────┘                   │
│         │   │          ↑                            │
└─────────┘   │          │                            │
    │         │   ┌──────────────────┐                │
    │         └───│ View Faculty List│                │
    │             └──────────────────┘                │
    │                     │                            │
    │             ┌───────────────────────┐            │
    │             │ View Availability     │            │
    │             └───────────────────────┘            │
    │                     │                            │
    │             ┌───────────────────────┐            │
    │             │ Book Appointment      │            │
    │             └───────────────────────┘            │
    │                     │                            │
    │             ┌───────────────────────┐            │
    │             │ Track Status          │            │
    │             └───────────────────────┘            │
    │                     │                            │
    │             ┌───────────────────────┐            │
    │             │ Cancel Appointment    │            │
    │             └───────────────────────┘            │
    │                                                  │
    │                                                  │
┌─────────┐     ┌──────────────┐                      │
│         │─────│    Login     │                      │
│ Faculty │     └──────────────┘                      │
│         │            │                               │
└─────────┘     ┌──────────────────────┐              │
    │           │ Manage Availability  │              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ View Requests        │              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ Approve Appointment  │              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ Reject Appointment   │              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ View History         │              │
    │           └──────────────────────┘              │
    │                                                  │
    │                                                  │
┌─────────┐     ┌──────────────┐                      │
│         │─────│    Login     │                      │
│  Admin  │     └──────────────┘                      │
│         │            │                               │
└─────────┘     ┌──────────────────────┐              │
    │           │ Manage Users         │              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ View All Appointments│              │
    │           └──────────────────────┘              │
    │                   │                              │
    │           ┌──────────────────────┐              │
    │           │ Generate Reports     │              │
    │           └──────────────────────┘              │
    │                                                  │
    └──────────────────────────────────────────────────┘
```

### Use Case Descriptions

#### UC-1: Student Registration
- **Actor:** Student
- **Precondition:** Student has valid email
- **Main Flow:**
  1. Student clicks Register
  2. System displays registration form
  3. Student enters details (name, email, roll number, password)
  4. System validates input
  5. System creates account
  6. System displays success message
- **Postcondition:** Student account created

#### UC-2: Book Appointment
- **Actor:** Student
- **Precondition:** Student is logged in
- **Main Flow:**
  1. Student selects faculty
  2. System displays available slots
  3. Student selects slot
  4. Student enters reason
  5. System checks availability
  6. System creates appointment request
  7. System displays confirmation
- **Postcondition:** Appointment request created

#### UC-3: Approve Appointment
- **Actor:** Faculty
- **Precondition:** Faculty is logged in, pending requests exist
- **Main Flow:**
  1. Faculty views appointment requests
  2. Faculty selects request
  3. Faculty clicks Approve
  4. System updates status to Approved
  5. System displays confirmation
- **Postcondition:** Appointment approved

---

## 3. CLASS DIAGRAM

### Purpose
Shows the static structure of the system including classes, attributes, methods, and relationships.

### Class Diagram

```
┌─────────────────────────────┐
│         User                │
├─────────────────────────────┤
│ - user_id: int              │
│ - email: string             │
│ - password: string          │
│ - user_type: string         │
│ - created_at: datetime      │
├─────────────────────────────┤
│ + login()                   │
│ + logout()                  │
│ + updateProfile()           │
└─────────────────────────────┘
         △
         │
    ┌────┴────┐
    │         │
┌───────────────────────┐  ┌───────────────────────┐
│      Student          │  │      Faculty          │
├───────────────────────┤  ├───────────────────────┤
│ - student_id: int     │  │ - faculty_id: int     │
│ - name: string        │  │ - name: string        │
│ - roll_number: string │  │ - department: string  │
│ - department: string  │  │ - designation: string │
│ - phone: string       │  │ - phone: string       │
├───────────────────────┤  ├───────────────────────┤
│ + register()          │  │ + createSlot()        │
│ + viewFaculty()       │  │ + viewSlots()         │
│ + bookAppointment()   │  │ + deleteSlot()        │
│ + viewAppointments()  │  │ + viewRequests()      │
│ + cancelAppointment() │  │ + approveRequest()    │
└───────────────────────┘  │ + rejectRequest()     │
         │                 └───────────────────────┘
         │                          │
         │                          │
         │         ┌────────────────┘
         │         │
         │         │
┌────────▼─────────▼──────────────┐
│      Appointment                │
├─────────────────────────────────┤
│ - appointment_id: int           │
│ - student_id: int (FK)          │
│ - faculty_id: int (FK)          │
│ - slot_id: int (FK)             │
│ - reason: string                │
│ - status: string                │
│ - created_at: datetime          │
│ - updated_at: datetime          │
├─────────────────────────────────┤
│ + create()                      │
│ + updateStatus()                │
│ + cancel()                      │
│ + getDetails()                  │
└─────────────────────────────────┘
         │
         │
         │
┌────────▼─────────────────────────┐
│      TimeSlot                    │
├──────────────────────────────────┤
│ - slot_id: int                   │
│ - faculty_id: int (FK)           │
│ - date: date                     │
│ - start_time: time               │
│ - end_time: time                 │
│ - is_available: boolean          │
│ - created_at: datetime           │
├──────────────────────────────────┤
│ + create()                       │
│ + checkAvailability()            │
│ + markBooked()                   │
│ + markAvailable()                │
│ + delete()                       │
└──────────────────────────────────┘


┌─────────────────────────────┐
│         Admin               │
├─────────────────────────────┤
│ - admin_id: int             │
│ - name: string              │
│ - email: string             │
├─────────────────────────────┤
│ + manageUsers()             │
│ + viewAllAppointments()     │
│ + generateReports()         │
│ + deleteUser()              │
└─────────────────────────────┘
```

### Relationships
1. **Inheritance:** Student and Faculty inherit from User
2. **Association:** Student and Faculty are associated with Appointment
3. **Association:** Faculty is associated with TimeSlot
4. **Association:** Appointment is associated with TimeSlot

### Class Descriptions

#### User Class
- **Purpose:** Base class for all users
- **Attributes:** user_id, email, password, user_type
- **Methods:** login(), logout(), updateProfile()

#### Student Class
- **Purpose:** Represents student users
- **Inherits:** User
- **Methods:** register(), viewFaculty(), bookAppointment()

#### Faculty Class
- **Purpose:** Represents faculty users
- **Inherits:** User
- **Methods:** createSlot(), viewRequests(), approveRequest()

#### Appointment Class
- **Purpose:** Represents appointment bookings
- **Attributes:** appointment_id, student_id, faculty_id, status
- **Methods:** create(), updateStatus(), cancel()

#### TimeSlot Class
- **Purpose:** Represents faculty availability slots
- **Attributes:** slot_id, faculty_id, date, start_time, end_time
- **Methods:** create(), checkAvailability(), markBooked()

---

## 4. SEQUENCE DIAGRAM

### Purpose
Shows the interaction between objects in a time sequence. It depicts how objects communicate with each other.

### Sequence Diagram: Book Appointment

```
Student      UI          Controller      Database      Faculty
  │           │              │              │            │
  │──Login───>│              │              │            │
  │           │──Validate───>│              │            │
  │           │              │──Query──────>│            │
  │           │              │<─Result──────│            │
  │           │<─Dashboard───│              │            │
  │           │              │              │            │
  │─Select────>│              │              │            │
  │ Faculty   │              │              │            │
  │           │──Get Slots──>│              │            │
  │           │              │──Query──────>│            │
  │           │              │<─Slots───────│            │
  │           │<─Show Slots──│              │            │
  │           │              │              │            │
  │─Select────>│              │              │            │
  │ Slot      │              │              │            │
  │           │──Check──────>│              │            │
  │           │  Availability│              │            │
  │           │              │──Query──────>│            │
  │           │              │<─Available───│            │
  │           │              │              │            │
  │─Enter─────>│              │              │            │
  │ Reason    │              │              │            │
  │           │              │              │            │
  │─Submit────>│              │              │            │
  │           │──Create─────>│              │            │
  │           │  Appointment │              │            │
  │           │              │──Insert─────>│            │
  │           │              │<─Success─────│            │
  │           │              │──Notify─────────────────>│
  │           │<─Confirm─────│              │            │
  │<─Success──│              │              │            │
  │ Message   │              │              │            │
```

### Sequence Diagram: Approve Appointment

```
Faculty      UI          Controller      Database      Student
  │           │              │              │            │
  │──Login───>│              │              │            │
  │           │──Validate───>│              │            │
  │           │              │──Query──────>│            │
  │           │              │<─Result──────│            │
  │           │<─Dashboard───│              │            │
  │           │              │              │            │
  │─View──────>│              │              │            │
  │ Requests  │              │              │            │
  │           │──Get────────>│              │            │
  │           │  Requests    │              │            │
  │           │              │──Query──────>│            │
  │           │              │<─Requests────│            │
  │           │<─Show List───│              │            │
  │           │              │              │            │
  │─Select────>│              │              │            │
  │ Request   │              │              │            │
  │           │──Show────────│              │            │
  │           │  Details     │              │            │
  │           │              │              │            │
  │─Click─────>│              │              │            │
  │ Approve   │              │              │            │
  │           │──Update─────>│              │            │
  │           │  Status      │              │            │
  │           │              │──Update─────>│            │
  │           │              │<─Success─────│            │
  │           │              │──Notify─────────────────>│
  │           │<─Confirm─────│              │            │
  │<─Success──│              │              │            │
  │ Message   │              │              │            │
```

---

## 5. ACTIVITY DIAGRAM

### Purpose
Shows the flow of activities in a system. It represents the workflow from start to end.

### Activity Diagram: Student Booking Process

```
                    ┌─────────┐
                    │  Start  │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Login  │
                    └────┬────┘
                         │
                  ┌──────▼──────┐
                  │ View Faculty│
                  │    List     │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │   Select    │
                  │   Faculty   │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │ View Available│
                  │    Slots    │
                  └──────┬──────┘
                         │
                    ┌────▼────┐
                    │ Slot    │
                    │Available?│
                    └────┬────┘
                         │
                    Yes  │  No
                    ┌────┴────┐
                    │         │
              ┌─────▼─────┐   │
              │  Select   │   │
              │   Slot    │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │   Enter   │   │
              │  Reason   │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │  Submit   │   │
              │  Request  │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │  Check    │   │
              │ Conflict  │   │
              └─────┬─────┘   │
                    │         │
               No   │  Yes    │
              ┌─────┴─────┐   │
              │           │   │
        ┌─────▼─────┐ ┌───▼───▼───┐
        │  Create   │ │   Show    │
        │Appointment│ │   Error   │
        └─────┬─────┘ └───────┬───┘
              │               │
        ┌─────▼─────┐         │
        │   Show    │         │
        │ Success   │         │
        └─────┬─────┘         │
              │               │
              └───────┬───────┘
                      │
                 ┌────▼────┐
                 │   End   │
                 └─────────┘
```

### Activity Diagram: Faculty Approval Process

```
                    ┌─────────┐
                    │  Start  │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Login  │
                    └────┬────┘
                         │
                  ┌──────▼──────┐
                  │ View Pending│
                  │  Requests   │
                  └──────┬──────┘
                         │
                    ┌────▼────┐
                    │Requests │
                    │ Exist?  │
                    └────┬────┘
                         │
                    Yes  │  No
                    ┌────┴────┐
                    │         │
              ┌─────▼─────┐   │
              │  Select   │   │
              │  Request  │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │   View    │   │
              │  Details  │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │  Decide   │   │
              └─────┬─────┘   │
                    │         │
          ┌─────────┴─────────┐
          │                   │
    ┌─────▼─────┐       ┌─────▼─────┐
    │  Approve  │       │  Reject   │
    └─────┬─────┘       └─────┬─────┘
          │                   │
    ┌─────▼─────┐       ┌─────▼─────┐
    │  Update   │       │  Update   │
    │  Status   │       │  Status   │
    │(Approved) │       │(Rejected) │
    └─────┬─────┘       └─────┬─────┘
          │                   │
          └─────────┬─────────┘
                    │
              ┌─────▼─────┐   │
              │   Notify  │   │
              │  Student  │   │
              └─────┬─────┘   │
                    │         │
              ┌─────▼─────┐   │
              │   Show    │   │
              │ Success   │   │
              └─────┬─────┘   │
                    │         │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │   End   │
                    └─────────┘
```

---

## 6. EXAM-ORIENTED EXPLANATIONS

### Q1: Explain Use Case Diagram
**Answer:** Use Case Diagram shows the interaction between actors (users) and the system. In EduMeet, we have three actors: Student, Faculty, and Admin. Each actor performs specific use cases like Login, Book Appointment, Approve Request, etc. It helps understand what the system does from the user's perspective.

### Q2: Explain Class Diagram
**Answer:** Class Diagram shows the static structure of the system with classes, attributes, methods, and relationships. In EduMeet, we have classes like User, Student, Faculty, Appointment, and TimeSlot. Student and Faculty inherit from User class. Appointment class connects Student and Faculty through relationships.

### Q3: Explain Sequence Diagram
**Answer:** Sequence Diagram shows the interaction between objects in time sequence. It depicts how objects communicate with each other. In the Book Appointment sequence, Student interacts with UI, which communicates with Controller, which queries Database, and finally notifies Faculty. The vertical axis represents time flow.

### Q4: Explain Activity Diagram
**Answer:** Activity Diagram shows the workflow of activities from start to end. It represents the flow of control in the system. In the Student Booking Process, activities flow from Login → View Faculty → Select Slot → Submit Request → Create Appointment. Decision points like "Slot Available?" create branches in the flow.

### Q5: What is the difference between Sequence and Activity Diagram?
**Answer:**
- **Sequence Diagram:** Shows interaction between objects (who communicates with whom)
- **Activity Diagram:** Shows flow of activities (what happens step by step)
- Sequence focuses on messages, Activity focuses on workflow

---

## 7. SUMMARY

### UML Diagrams Created for EduMeet:

1. **Use Case Diagram:** Shows 3 actors and their interactions
2. **Class Diagram:** Shows 5 main classes with relationships
3. **Sequence Diagram:** Shows 2 key processes (Booking and Approval)
4. **Activity Diagram:** Shows 2 workflows (Student and Faculty)

These diagrams provide complete understanding of the system from different perspectives and are essential for software design documentation.
