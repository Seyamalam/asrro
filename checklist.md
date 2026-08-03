# ASRRO Web Portal — SRS Checklist

Source: [`docs/SRS.docx`](docs/SRS.docx), version 1.0.

This checklist converts the complete SRS into independently verifiable acceptance items. Check an item only after it is implemented, connected to persistent data where applicable, authorized correctly, responsive, and tested.

## 1. Introduction and project scope

### 1.1 Organization and domain coverage

- [ ] Represent ASRRO as a frontier technology research organization based at Chittagong University of Engineering & Technology (CUET), Bangladesh.
- [ ] Support ASRRO work in space science.
- [ ] Support ASRRO work in robotics.
- [ ] Support ASRRO work in artificial intelligence.
- [ ] Support ASRRO work in electronics.
- [ ] Support ASRRO work in IoT.
- [ ] Support ASRRO research and publications.
- [ ] Support ASRRO engineering competitions.
- [ ] Support ASRRO workshops.
- [ ] Support ASRRO national-level events.

### 1.2 Platform responsibilities

- [ ] Provide the official organizational website.
- [ ] Provide a membership management system.
- [ ] Provide an event management platform.
- [ ] Provide an executive committee management portal.
- [ ] Provide a finance management portal.
- [ ] Provide an alumni showcase.
- [ ] Provide a project portfolio.
- [ ] Provide an internal administration dashboard.
- [ ] Scale to thousands of members and multiple national events.

## 2. Objectives

- [ ] Represent ASRRO professionally.
- [ ] Increase ASRRO's public visibility.
- [ ] Digitize club membership.
- [ ] Automate event registration.
- [ ] Manage club members.
- [ ] Manage executive committee operations.
- [ ] Store club history.
- [ ] Showcase projects.
- [ ] Showcase alumni.
- [ ] Generate downloadable reports.
- [ ] Reduce manual paperwork.

## 3. Users, roles, and permissions

### 3.1 Guest

- [ ] Allow guests to visit the public website.
- [ ] Allow guests to view projects.
- [ ] Allow guests to view events.
- [ ] Allow guests to view the gallery.
- [ ] Allow guests to view alumni.
- [ ] Allow guests to read blogs and news.
- [ ] Allow guests to contact the organization.
- [ ] Allow guests to apply for membership.
- [ ] Allow guests to register for public events.
- [ ] Prevent guests from viewing the dashboard.
- [ ] Prevent guests from editing a member profile.
- [ ] Prevent guests from accessing member-only pages.

### 3.2 Pending member

- [ ] Allow pending members to log in.
- [ ] Allow pending members to view their application status.
- [ ] Prevent pending members from downloading a membership card.
- [ ] Prevent pending members from registering for members-only events.
- [ ] Prevent pending members from accessing the member dashboard.

### 3.3 General member

- [ ] Allow general members to log in.
- [ ] Allow general members to view the member dashboard.
- [ ] Allow general members to update only permitted profile information.
- [ ] Allow general members to view attended events.
- [ ] Allow general members to register for eligible events.
- [ ] Allow general members to download their membership card.
- [ ] Allow general members to download their payment receipt.
- [ ] Allow general members to view notifications.
- [ ] Prevent general members from managing other members.
- [ ] Prevent general members from editing events.
- [ ] Prevent general members from accessing finance data.

### 3.4 Executive committee member

- [ ] Give executive committee members all general-member permissions.
- [ ] Make executive management capabilities depend on assigned role and permission.
- [ ] Support the President role.
- [ ] Support the Vice President role.
- [ ] Support the General Secretary role.
- [ ] Support the Joint General Secretary role.
- [ ] Support the Organizing Secretary role.
- [ ] Support the Financial Secretary role.
- [ ] Support the Public Relations Secretary role.
- [ ] Support the Research & Publication Secretary role.
- [ ] Support the Technical Secretary role.
- [ ] Support Executive Member roles.

### 3.5 Super admin

- [ ] Give super admins full system control.
- [ ] Allow super admins to manage every module.
- [ ] Allow super admins to create executive accounts.
- [ ] Allow super admins to reset passwords.
- [ ] Allow super admins to configure the website.
- [ ] Allow super admins to assign permissions.

## 4. Public website

### 4.1 Home

- [ ] Display a hero banner.
- [ ] Display an introduction.
- [ ] Display an About ASRRO summary.
- [ ] Display the mission.
- [ ] Display the vision.
- [ ] Display current highlights.
- [ ] Display upcoming events.
- [ ] Display featured projects.
- [ ] Display organizational statistics.
- [ ] Include a member-count statistic.
- [ ] Include a project-count statistic.
- [ ] Include an event-count statistic.
- [ ] Include an alumni-count statistic.
- [ ] Include a research-paper-count statistic.

### 4.2 About

- [ ] Present ASRRO's history.
- [ ] Present ASRRO's mission.
- [ ] Present ASRRO's vision.
- [ ] Present ASRRO's core values.
- [ ] Present a journey timeline.

### 4.3 Executive committee

- [ ] Show the current committee.
- [ ] Show each committee member's position.
- [ ] Show each committee member's photograph.
- [ ] Show each committee member's department.
- [ ] Show each committee member's session.
- [ ] Optionally show committee-member contact information.

### 4.4 Alumni

- [ ] Provide a dedicated alumni page.
- [ ] Show each alumnus's photo.
- [ ] Show each alumnus's name.
- [ ] Show each alumnus's department.
- [ ] Show each alumnus's session.
- [ ] Show each alumnus's current workplace.
- [ ] Show each alumnus's higher-studies information.
- [ ] Optionally show each alumnus's LinkedIn profile.
- [ ] Show each alumnus's research interests.
- [ ] Support alumni search or filtering by batch.
- [ ] Support alumni search or filtering by department.
- [ ] Support alumni search or filtering by graduation year.

### 4.5 Projects

- [ ] Support completed projects.
- [ ] Support ongoing projects.
- [ ] Support research projects.
- [ ] Support competition projects.
- [ ] Support industry-collaboration projects.
- [ ] Show a cover image for each project.
- [ ] Show each project's title.
- [ ] Show each project's description.
- [ ] Show each project's technology stack.
- [ ] Show each project's team members.
- [ ] Show each project's duration.
- [ ] Show each project's status.
- [ ] Show each project's GitHub repository.
- [ ] Show publications related to each project.
- [ ] Show awards related to each project.
- [ ] Filter projects by robotics.
- [ ] Filter projects by AI.
- [ ] Filter projects by space.
- [ ] Filter projects by embedded systems.
- [ ] Filter projects by IoT.
- [ ] Filter projects by electronics.

### 4.6 Events

#### Discovery and presentation

- [ ] Support upcoming events.
- [ ] Support ongoing events.
- [ ] Support past events.
- [ ] Provide a tile/card event view.
- [ ] Provide a calendar-grid event view.

#### Event information

- [ ] Show an event banner.
- [ ] Show the event name.
- [ ] Show the event category.
- [ ] Show the event date.
- [ ] Show the event time.
- [ ] Show the event venue.
- [ ] Show the event organizer.
- [ ] Show the registration deadline.
- [ ] Show the event capacity.
- [ ] Show the event description.
- [ ] Show the event rules.
- [ ] Show event eligibility.
- [ ] Show the registration fee.
- [ ] Show the event contact person.

#### Categories

- [ ] Support workshop events.
- [ ] Support competition events.
- [ ] Support seminar events.
- [ ] Support bootcamp events.
- [ ] Support training events.
- [ ] Support national olympiad events.
- [ ] Support research-talk events.

#### Scope and eligibility

- [ ] Support Intra CUET events.
- [ ] Restrict Intra CUET event registration to CUET students.
- [ ] Support divisional events.
- [ ] Restrict divisional event registration to universities in Chattogram Division.
- [ ] Support national events.
- [ ] Open national events to everyone who satisfies the stated eligibility rules.

#### Participant registration

- [ ] Allow eligible users to register for events.
- [ ] Allow a registrant to cancel before the registration deadline.
- [ ] Allow a registrant to download participation confirmation.
- [ ] Allow a registrant to view registration status.

#### Administrative registration management

- [ ] Allow authorized administrators to accept registrations.
- [ ] Allow authorized administrators to reject registrations.
- [ ] Allow authorized administrators to mark attendance.
- [ ] Allow authorized administrators to export participant lists.
- [ ] Export participant lists as CSV.
- [ ] Export participant lists as Excel workbooks.
- [ ] Export participant lists as PDF documents.

### 4.7 Gallery

- [ ] Support gallery images.
- [ ] Support gallery albums.
- [ ] Support gallery videos.
- [ ] Group gallery media by event.

### 4.8 Publications

- [ ] Publish research papers.
- [ ] Publish magazines.
- [ ] Publish reports.
- [ ] Publish annual publications.

### 4.9 Blogs and news

- [ ] Support rich-text blog and news content.
- [ ] Support content categories.
- [ ] Support content tags.
- [ ] Optionally support comments.

### 4.10 Contact

- [ ] Display the office address.
- [ ] Display an email address.
- [ ] Display a phone number.
- [ ] Display a Google Map.
- [ ] Link to Facebook.
- [ ] Link to LinkedIn.
- [ ] Link to YouTube.
- [ ] Link to GitHub.
- [ ] Link to Instagram.
- [ ] Provide a contact form with a name field.
- [ ] Provide a contact form with an email field.
- [ ] Provide a contact form with a subject field.
- [ ] Provide a contact form with a message field.
- [ ] Submit and persist or deliver contact-form messages.

## 5. Membership system

### 5.1 Registration form

- [ ] Collect the applicant's full name.
- [ ] Collect a profile picture.
- [ ] Optionally collect date of birth.
- [ ] Collect gender.
- [ ] Collect blood group.
- [ ] Collect email.
- [ ] Collect phone number.
- [ ] Collect institute.
- [ ] Collect university name.
- [ ] Collect department.
- [ ] Collect semester.
- [ ] Collect student ID.
- [ ] Collect HSC batch.
- [ ] Collect address.
- [ ] Collect an emergency contact.
- [ ] Collect payment method.

### 5.2 Membership payment

- [ ] Support bKash payments.
- [ ] Support Nagad payments.
- [ ] Support Rocket payments.
- [ ] Collect the transaction ID.
- [ ] Optionally collect a payment screenshot.

### 5.3 Application state

- [ ] Support pending membership applications.
- [ ] Support approved membership applications.
- [ ] Support rejected membership applications.

## 6. Membership approval workflow

- [ ] Allow an applicant to submit a membership application.
- [ ] Notify or surface the application to the executive committee for review.
- [ ] Allow the executive committee to approve an application.
- [ ] Allow the executive committee to reject an application.
- [ ] Generate a UUID after approval.
- [ ] Send the approved member a confirmation email.
- [ ] Activate the approved member's dashboard.
- [ ] Preserve the workflow order: submit → review → approve/reject → UUID → email → dashboard activation.

## 7. ASRRO UUID generation

### 7.1 Format and behavior

- [ ] Assign every approved member a permanent ASRRO UUID.
- [ ] Format UUIDs as `[Galaxy Code][Star Code]-Member Number`.
- [ ] Support examples such as `AR-053`, `MP-014`, and `WV-120`.
- [ ] Automatically increment the member number.
- [ ] Decide and document whether numbering increments per unique Galaxy–Star combination or globally.
- [ ] Make recommended galaxy codes configurable.
- [ ] Prevent duplicate UUIDs under concurrent approvals.

### 7.2 HSC batch to galaxy mapping

- [ ] Map HSC batch 20 to Cartwheel.
- [ ] Map HSC batch 21 to Andromeda.
- [ ] Map HSC batch 22 to Milky Way.
- [ ] Map HSC batch 23 to Whirlpool.

### 7.3 Recommended galaxy/star codes

- [ ] Configure Cartwheel + Deneb as `CD`.
- [ ] Configure Andromeda + Rigel as `AR`.
- [ ] Configure Milky Way + Polaris as `MP`.
- [ ] Configure Whirlpool + Vega as `WV`.

### 7.4 Department to star mapping

- [ ] Map Mechanical to Vega.
- [ ] Map URP to Arcturus.
- [ ] Map Architecture to Betelgeuse.
- [ ] Map PME to Capella.
- [ ] Map CSE to Rigel.
- [ ] Map EEE to Polaris.
- [ ] Map Civil to Zubenelgenubi.
- [ ] Map ETE to Lethas.
- [ ] Map MIE to Deneb.
- [ ] Map BME to Fomalhaut.
- [ ] Map MME to Kochab.
- [ ] Map WRE to Sirius.

## 8. General member dashboard

### 8.1 Dashboard content

- [ ] Display a welcome panel.
- [ ] Display the member's UUID.
- [ ] Display membership status.
- [ ] Provide profile access.
- [ ] Provide membership-card access.
- [ ] Show upcoming events.
- [ ] Show registered events.
- [ ] Show attended events.
- [ ] Show notifications.

### 8.2 Membership card

- [ ] Display the member's photo.
- [ ] Display the member's name.
- [ ] Display the member's UUID.
- [ ] Display the member's department.
- [ ] Display the member's batch.
- [ ] Display a scannable QR code.
- [ ] Encode verifiable member identity in the QR workflow.
- [ ] Display membership validity.
- [ ] Display the organization logo.
- [ ] Allow the card to be downloaded as a PDF.

## 9. Executive dashboard

### 9.1 Member management

- [ ] Approve members.
- [ ] Reject members.
- [ ] Suspend members.
- [ ] Delete members.
- [ ] Edit members.
- [ ] Search members.
- [ ] Filter members.
- [ ] Support bulk member approval.
- [ ] Support bulk member email.

### 9.2 Event management

- [ ] Create events.
- [ ] Update events.
- [ ] Delete events.
- [ ] Clone a previous event.
- [ ] Manage event registrations.
- [ ] Manage attendance.
- [ ] Preserve certificate generation as a future capability or extension point.

### 9.3 Executive committee management

- [ ] Maintain the current committee.
- [ ] Maintain committee positions.
- [ ] Maintain committee sessions.
- [ ] Export the committee list as PDF.

## 10. Finance module

### 10.1 Authorization

- [ ] Restrict detailed finance access.
- [ ] Allow the President to access detailed finance data.
- [ ] Allow the Vice President to access detailed finance data.
- [ ] Allow the Financial Secretary to access detailed finance data.
- [ ] Allow the Organizing Secretary to access detailed finance data.
- [ ] Allow other roles to see only high-level summaries when explicitly permitted.

### 10.2 Finance records

- [ ] Record income.
- [ ] Record expenses.
- [ ] Track membership fees.
- [ ] Track event budgets.
- [ ] Track sponsor contributions.
- [ ] Track equipment purchases.
- [ ] Track travel costs.
- [ ] Track miscellaneous finance entries.

### 10.3 Finance reports and exports

- [ ] Generate monthly finance reports.
- [ ] Generate quarterly finance reports.
- [ ] Generate yearly finance reports.
- [ ] Export finance data as CSV.
- [ ] Export finance data as Excel workbooks.
- [ ] Export finance data as PDF documents.

### 10.4 Finance charts

- [ ] Chart income versus expense.
- [ ] Chart cash flow.
- [ ] Chart monthly trends.
- [ ] Chart expense categories.

## 11. Search system

- [ ] Provide global search.
- [ ] Search members.
- [ ] Search projects.
- [ ] Search events.
- [ ] Search alumni.
- [ ] Search blogs.
- [ ] Search committee members.
- [ ] Enforce role-based visibility in search results.

## 12. Notification system

- [ ] Support email notifications.
- [ ] Support dashboard notifications.
- [ ] Notify applicants when an application is approved.
- [ ] Notify applicants when an application is rejected.
- [ ] Send event reminders.
- [ ] Confirm successful event registrations.
- [ ] Send committee announcements.

## 13. File management

- [ ] Upload images.
- [ ] Upload PDF files.
- [ ] Upload videos.
- [ ] Upload documents.
- [ ] Upload profile pictures.
- [ ] Upload event banners.
- [ ] Authorize file uploads and access by role and ownership.
- [ ] Validate file type and size.

## 14. Reports

### 14.1 Report types

- [ ] Generate a member-list report.
- [ ] Generate a pending-members report.
- [ ] Generate an attendance report.
- [ ] Generate a financial report.
- [ ] Generate an executive-list report.
- [ ] Generate an event-registrations report.
- [ ] Generate a project-inventory report.

### 14.2 Report formats

- [ ] Generate reports as PDF.
- [ ] Generate reports as CSV.
- [ ] Generate reports as Excel workbooks.

## 15. Admin settings

- [ ] Manage the website logo.
- [ ] Manage hero banners.
- [ ] Manage social links.
- [ ] Manage email templates.
- [ ] Manage the gallery.
- [ ] Manage homepage sections.
- [ ] Manage theme colors.
- [ ] Manage contact information.

## 16. Non-functional requirements

### 16.1 Performance

- [ ] Load the home page in under 2 seconds under the defined test conditions.
- [ ] Load the dashboard in under 3 seconds under the defined test conditions.
- [ ] Document the performance-test environment, dataset, device, network, and percentile used for acceptance.

### 16.2 Security

- [ ] Serve production traffic over HTTPS.
- [ ] Hash passwords securely.
- [ ] Enforce role-based authorization on the server.
- [ ] Protect state-changing requests against CSRF.
- [ ] Prevent SQL-injection-style query injection.
- [ ] Prevent cross-site scripting (XSS).
- [ ] Validate all untrusted input.

### 16.3 Scalability

- [ ] Support at least 10,000 members.
- [ ] Support at least 500 events.
- [ ] Support at least 100,000 event registrations.
- [ ] Validate scale requirements with representative data and load tests.

### 16.4 Availability

- [ ] Target 99.9% service availability.
- [ ] Define availability measurement, monitoring, and reporting.

### 16.5 Responsive design

- [ ] Support desktop layouts.
- [ ] Support tablet layouts.
- [ ] Support mobile layouts.

### 16.6 Accessibility

- [ ] Meet WCAG AA requirements where practical.
- [ ] Document any accepted accessibility exceptions and remediation plan.

## 17. Deliverables

- [ ] Provide source code in a GitHub repository.
- [ ] Provide a deployment link.
- [ ] Provide the database schema or ER diagram.
- [ ] Provide API documentation.
- [ ] Provide an installation guide.
- [ ] Provide admin credentials.
- [ ] Provide a user manual.
- [ ] Provide a README.

## 18. Production-readiness and evaluation criteria

- [ ] Deliver a production-ready web platform for ASRRO.
- [ ] Deliver a complete organizational management system.
- [ ] Integrate public-facing content management.
- [ ] Integrate the complete membership lifecycle.
- [ ] Integrate role-based administration.
- [ ] Integrate event management.
- [ ] Integrate project showcasing.
- [ ] Integrate alumni tracking.
- [ ] Integrate executive committee operations.
- [ ] Integrate financial management.
- [ ] Provide an intuitive user experience.
- [ ] Use a maintainable system design.
- [ ] Make the platform extensible.
- [ ] Make the platform deployable in real-world environments.
- [ ] Support ASRRO's long-term growth as a frontier technology research organization.

## Completion gate

- [ ] Every checked functional requirement has an implementation reference.
- [ ] Every checked permission requirement has a server-side authorization test.
- [ ] Every checked workflow has a successful-path and failure-path test.
- [ ] Every checked public and dashboard surface is verified on desktop, tablet, and mobile.
- [ ] Every checked export produces a valid, downloadable file in its required format.
- [ ] Every checked non-functional requirement has reproducible evidence.
- [ ] Documentation and demo credentials match the deployed behavior.
- [ ] The production deployment passes a final end-to-end acceptance review.
