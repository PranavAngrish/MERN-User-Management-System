### MERN Authentication & Authorization with JWT

---

##### Authentication & Authorization

- Provide signup option.
- Provide login option.
- Provide logout option.
- Provide persist login option for 7 days.
- Require users to login at least once a week for security.
- Automatically log out after 15 minutes if the persistent login option is unchecked.
- Detect abusive traffic or bot with reCAPTCHA v3.
- Verify email is a one-time email or a fake email.
- Activate account after email verification.
- Use bcrypt to encrypt and protect user account passwords.
- Securely transmitting information between parties with JWT.
- Roles can be User or Admin.
- Display current user and assigned role with status bar.

---

##### User Management

- Root user has maximum privileges.
- Only Root user and Admins can access User Settings.
- Admin can't delete or change each other's profiles.
- Root user and Admins able to create new users.
- Root user and Admins can change user's name, email, password, and roles.
- Provides a feature for searching user names to find out users details.
- Provide a permission feature that restricts user access as soon as possible if needed (Deactivate Account).
- Provide a way to remove user access (Delete Account).

---

##### Task Management

- Task are assigned to specific user.
- User can only view their assigned task.
- Root user can view, edit, and delete all Task.
- Task creators can view, edit, update and delete tasks.
- Task can only be deleted by the admin or Root user who created the task.
- Task status are either PENDING, EXPIRED or COMPLETED.
- Status bar shows tasks creator, created, and edited date time details.
- Admin and root users can view who has been assigned to a task via the list.

---

##### Note Management

- Markdown support
- Users can create, view, edit, and delete their own note.
- Root user and Admin have permission to view, edit, and delete user notes if needed.
- Provides search features for titles/tags searching, to view the contents of notes.
- Tags are provided for tagging notes.

In fact, I don't know what kind of website this is. I just use it purely to learn about Authentication and Authorization. Just think it's a user management system.
Features will continuously update...
