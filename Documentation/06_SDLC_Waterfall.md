# SOFTWARE DEVELOPMENT LIFE CYCLE (SDLC)
## Waterfall Model

---

## 1. INTRODUCTION TO SDLC

### What is SDLC?
Software Development Life Cycle (SDLC) is a systematic process used to develop software applications. It defines phases and activities required to build high-quality software that meets customer requirements.

### Why SDLC is Important?
- Provides structured approach to software development
- Ensures quality and consistency
- Reduces development risks
- Helps in project planning and management
- Facilitates communication among team members

---

## 2. WATERFALL MODEL

### Definition
The Waterfall Model is a linear sequential software development process where progress flows steadily downwards (like a waterfall) through distinct phases. Each phase must be completed before the next phase begins.

### Waterfall Model Diagram

```
┌─────────────────────────────────┐
│   1. REQUIREMENT ANALYSIS       │
│   (What to build?)              │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   2. SYSTEM DESIGN              │
│   (How to build?)               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   3. IMPLEMENTATION             │
│   (Building the system)         │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   4. TESTING                    │
│   (Verification)                │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   5. DEPLOYMENT                 │
│   (Release to users)            │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   6. MAINTENANCE                │
│   (Updates & Support)           │
└─────────────────────────────────┘
```

---

## 3. PHASES OF WATERFALL MODEL

### Phase 1: Requirement Analysis

**Objective:** Understand and document what the system should do

**Activities:**
- Gather requirements from stakeholders (students, faculty, admin)
- Identify functional requirements (login, booking, approval)
- Identify non-functional requirements (security, performance)
- Document requirements in SRS document
- Get approval from stakeholders

**Deliverables:**
- Software Requirements Specification (SRS) document
- Feasibility study report
- Project plan

**For EduMeet Project:**
- Identified need for appointment management system
- Documented features: user authentication, slot management, booking system
- Defined user roles: Student, Faculty, Admin
- Listed functional requirements (FR-1.1 to FR-5.2)
- Listed non-functional requirements (performance, security, usability)

**Duration:** 2 weeks

---

### Phase 2: System Design

**Objective:** Plan how the system will be built

**Activities:**
- Design system architecture (3-tier architecture)
- Design database schema (tables, relationships)
- Create UML diagrams (Use Case, Class, Sequence, Activity)
- Design user interface mockups
- Define technology stack
- Plan module structure

**Deliverables:**
- System Design Document
- Database Schema
- UML Diagrams
- UI/UX Mockups
- Architecture Diagram

**For EduMeet Project:**
- Designed 3-tier architecture: UI Layer, Application Layer, Database Layer
- Created database with 5 tables: users, faculty, students, appointments, time_slots
- Designed UML diagrams showing system behavior
- Planned Flask application structure with routes and templates
- Designed responsive UI with HTML/CSS/JavaScript

**Duration:** 2 weeks

---

### Phase 3: Implementation (Coding)

**Objective:** Build the actual system based on design

**Activities:**
- Set up development environment
- Create database and tables
- Develop backend code (Python Flask)
- Develop frontend code (HTML, CSS, JavaScript)
- Implement business logic
- Write code comments
- Follow coding standards

**Deliverables:**
- Source code (Backend + Frontend)
- Database scripts
- Configuration files
- Code documentation

**For EduMeet Project:**
- Created MySQL database with all tables
- Developed Flask application (app.py)
- Created routes for all functionalities
- Developed HTML templates for all pages
- Implemented CSS styling
- Added JavaScript for client-side validation
- Implemented password hashing for security
- Created session management

**Duration:** 4 weeks

---

### Phase 4: Testing

**Objective:** Verify that system works correctly

**Activities:**
- Unit testing (individual functions)
- Integration testing (modules working together)
- System testing (complete system)
- User acceptance testing (UAT)
- Bug fixing
- Performance testing
- Security testing

**Deliverables:**
- Test cases document
- Test results report
- Bug reports
- Fixed code

**For EduMeet Project:**
- Tested user registration and login
- Tested appointment booking flow
- Tested conflict detection mechanism
- Tested all CRUD operations
- Verified role-based access control
- Tested on different browsers
- Fixed identified bugs

**Duration:** 2 weeks

---

### Phase 5: Deployment

**Objective:** Release the system for actual use

**Activities:**
- Set up production server
- Deploy application
- Configure database
- Set up domain and hosting
- User training
- Create user manuals
- Go-live

**Deliverables:**
- Deployed application
- User manual
- Training materials
- Deployment documentation

**For EduMeet Project:**
- Deployed on local server / cloud platform
- Configured MySQL database
- Set up Flask application
- Created user accounts for testing
- Provided system access to users
- Conducted training session

**Duration:** 1 week

---

### Phase 6: Maintenance

**Objective:** Support and update the system

**Activities:**
- Monitor system performance
- Fix bugs reported by users
- Add new features (if required)
- Update documentation
- Database backup and recovery
- Security updates

**Deliverables:**
- Bug fix releases
- Updated documentation
- Performance reports
- Backup files

**For EduMeet Project:**
- Monitor daily usage
- Fix any reported issues
- Add new features based on feedback
- Regular database backups
- Update user manual

**Duration:** Ongoing

---

## 4. ADVANTAGES OF WATERFALL MODEL

### 1. Simple and Easy to Understand
- Clear phases with specific deliverables
- Easy to explain to non-technical stakeholders
- Straightforward project management

### 2. Well-Documented
- Each phase produces documentation
- Easy to understand system even after development
- Helpful for maintenance

### 3. Easy to Manage
- Phases are completed one at a time
- Clear milestones and deadlines
- Easy to track progress

### 4. Works Well for Small Projects
- EduMeet is a small to medium-sized project
- Requirements are clear and stable
- Suitable for academic projects

### 5. Disciplined Approach
- Structured methodology
- No phase is skipped
- Quality assurance at each phase

---

## 5. DISADVANTAGES OF WATERFALL MODEL

### 1. Inflexible
- Difficult to go back to previous phase
- Changes are costly
- Not suitable for projects with changing requirements

### 2. Late Testing
- Testing happens after implementation
- Bugs discovered late are expensive to fix

### 3. No Working Software Until Late
- Users see product only at the end
- Risk of not meeting user expectations

### 4. Not Suitable for Complex Projects
- Large projects have evolving requirements
- Waterfall assumes all requirements are known upfront

---

## 6. WHY WATERFALL MODEL FOR EDUMEET?

### Reasons for Choosing Waterfall Model:

#### 1. Clear Requirements
- Requirements are well-defined and stable
- No major changes expected during development
- Scope is fixed

#### 2. Small Project Size
- EduMeet is a minor project
- Can be completed in 10-12 weeks
- Limited complexity

#### 3. Academic Project
- Follows structured approach required for academic evaluation
- Easy to document each phase
- Clear deliverables for assessment

#### 4. Fixed Timeline
- Project has fixed deadline
- Waterfall provides clear schedule
- Easy to plan and execute

#### 5. Technology is Known
- Using familiar technologies (Python, MySQL, HTML)
- No experimentation required
- Straightforward implementation

#### 6. Single Development Team
- Small team working together
- No need for iterative feedback
- Linear progression works well

---

## 7. PROJECT TIMELINE

### Gantt Chart Representation

```
Phase                    Week 1  Week 2  Week 3  Week 4  Week 5  Week 6  Week 7  Week 8  Week 9  Week 10
─────────────────────────────────────────────────────────────────────────────────────────────────────────
Requirement Analysis     [████]
System Design                    [████]
Implementation                           [████] [████] [████] [████]
Testing                                                                 [████] [████]
Deployment                                                                             [████]
Maintenance                                                                                    [████]→
```

### Phase-wise Effort Distribution

| Phase | Duration | Effort % |
|-------|----------|----------|
| Requirement Analysis | 2 weeks | 15% |
| System Design | 2 weeks | 20% |
| Implementation | 4 weeks | 40% |
| Testing | 2 weeks | 15% |
| Deployment | 1 week | 5% |
| Maintenance | Ongoing | 5% |

---

## 8. APPLICATION OF WATERFALL MODEL TO EDUMEET

### Phase-wise Implementation Details

#### Week 1-2: Requirement Analysis
- Conducted interviews with students and faculty
- Identified pain points in current system
- Documented functional requirements
- Created SRS document
- Got approval from project guide

#### Week 3-4: System Design
- Designed database schema with 5 tables
- Created UML diagrams (Use Case, Class, Sequence, Activity)
- Designed UI mockups for all pages
- Planned Flask application structure
- Finalized technology stack

#### Week 5-8: Implementation
- Week 5: Set up environment, created database, basic Flask app
- Week 6: Implemented user authentication, student module
- Week 7: Implemented faculty module, appointment booking
- Week 8: Implemented admin module, conflict detection

#### Week 9-10: Testing
- Week 9: Unit testing, integration testing, bug fixing
- Week 10: System testing, user acceptance testing

#### Week 11: Deployment
- Deployed application on server
- Conducted user training
- Created user manual

#### Week 12+: Maintenance
- Ongoing support and updates

---

## 9. CONCLUSION

The Waterfall Model is an appropriate choice for the EduMeet project because:
- Requirements are clear and stable
- Project size is manageable
- Timeline is fixed
- Structured approach suits academic evaluation
- Team is familiar with technologies

The linear progression of phases ensures systematic development with proper documentation at each stage, making it ideal for a BTech minor project.

---

## 10. EXAM-ORIENTED QUESTIONS & ANSWERS

**Q1: What is SDLC?**
**A:** SDLC (Software Development Life Cycle) is a systematic process for developing software that includes phases like requirement analysis, design, implementation, testing, deployment, and maintenance.

**Q2: What is Waterfall Model?**
**A:** Waterfall Model is a linear sequential software development model where each phase must be completed before the next phase begins. Progress flows downward like a waterfall.

**Q3: What are the phases of Waterfall Model?**
**A:** The six phases are:
1. Requirement Analysis
2. System Design
3. Implementation
4. Testing
5. Deployment
6. Maintenance

**Q4: What are advantages of Waterfall Model?**
**A:** 
- Simple and easy to understand
- Well-documented
- Easy to manage
- Works well for small projects
- Disciplined approach

**Q5: What are disadvantages of Waterfall Model?**
**A:**
- Inflexible to changes
- Late testing
- No working software until late
- Not suitable for complex projects

**Q6: Why did you choose Waterfall Model for your project?**
**A:** We chose Waterfall Model because:
- Requirements are clear and stable
- Project size is small
- Fixed timeline
- Suitable for academic projects
- Technology is known

**Q7: What is the difference between Waterfall and Agile?**
**A:** 
- Waterfall is linear, Agile is iterative
- Waterfall has fixed requirements, Agile allows changes
- Waterfall delivers at end, Agile delivers incrementally
- Waterfall is document-heavy, Agile is code-focused
