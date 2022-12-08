### MERN Authentication & Authorization with JWT

---

##### Authentication & Authorization

- Provide signup option.
- Provide login option.
- Provide logout option.
- Provide persist login option for 7 days.
- Require users to login at least once a week for security.
- Automatically log out after 15 minutes if the persistent login option is unchecked.
- Activate account after email verification.
- Roles can be User or Admin.
- Display current user and assigned role.

---

##### User Management

- Root user has maximum privileges.
- Only Root user and Admins can access User Settings.
- Admin cannot delete or change each other.
- Root user and Admins can create new users.
- Root user and Admins can change user name, email, password, and roles.
- Provides a feature for searching user names to find users details.
- Provide a permission feature that restricts user access as soon as possible if needed.
- Provide a way to remove user access.

---

##### Task Management

- Task are assigned to specific user.
- User can only view their assigned task.
- Root user and Admin can view, edit, and delete all Task.
- Task can only be deleted by the admin or Root user who created the task.
- Task status are either PENDING, EXPIRED or COMPLETED.
- Show who created the task, when it was created, and when it was edited.
- Admin and root users can see who the tasks have been assigned to via the list.

---

##### Note Management

- Markdown support
- Users can view, edit, and delete their own note.
- Root user and Admin have permission to view, edit, and delete user notes if needed.
- Provides search features for titles searching, to view the contents of notes.

In fact, I don't know what kind of website this is. I just use it purely to learn about Authentication and Authorization. Just think it's a user management system.
Features will continuously update...
