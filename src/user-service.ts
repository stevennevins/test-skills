// User Service - manages user operations
// This file intentionally has code quality issues for testing simplify skills

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  emailFrequency: string;
}

// Duplicated validation logic - exists in three places
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateUserEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Unnecessary class wrapping what should be simple functions
class UserValidator {
  private static instance: UserValidator;

  private constructor() {}

  static getInstance(): UserValidator {
    if (!UserValidator.instance) {
      UserValidator.instance = new UserValidator();
    }
    return UserValidator.instance;
  }

  validate(user: Partial<User>): string[] {
    const errors: string[] = [];

    if (!user.name) {
      errors.push("Name is required");
    }
    if (!user.email) {
      errors.push("Email is required");
    }
    if (user.email && !validateEmail(user.email)) {
      errors.push("Email is invalid");
    }
    if (user.age !== undefined && user.age < 0) {
      errors.push("Age must be positive");
    }
    if (user.age !== undefined && user.age > 200) {
      errors.push("Age must be reasonable");
    }
    if (!user.role) {
      errors.push("Role is required");
    }
    if (user.role && !["admin", "user", "moderator"].includes(user.role)) {
      errors.push("Invalid role");
    }

    return errors;
  }
}

// Over-engineered factory pattern for creating users
class UserFactory {
  private static instance: UserFactory;

  private constructor() {}

  static getInstance(): UserFactory {
    if (!UserFactory.instance) {
      UserFactory.instance = new UserFactory();
    }
    return UserFactory.instance;
  }

  createUser(name: string, email: string, age: number, role: string): User {
    return {
      id: generateId(),
      name: name,
      email: email,
      age: age,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferences: {
        theme: "light",
        language: "en",
        notifications: true,
        emailFrequency: "daily",
      },
    };
  }

  createAdmin(name: string, email: string, age: number): User {
    return {
      id: generateId(),
      name: name,
      email: email,
      age: age,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferences: {
        theme: "dark",
        language: "en",
        notifications: true,
        emailFrequency: "immediately",
      },
    };
  }

  createModerator(name: string, email: string, age: number): User {
    return {
      id: generateId(),
      name: name,
      email: email,
      age: age,
      role: "moderator",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferences: {
        theme: "light",
        language: "en",
        notifications: true,
        emailFrequency: "daily",
      },
    };
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Inefficient search - loops through everything multiple times
function findUsersByRole(users: User[], role: string): User[] {
  const result: User[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].role === role) {
      result.push(users[i]);
    }
  }
  return result;
}

function findActiveUsers(users: User[]): User[] {
  const result: User[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].isActive === true) {
      result.push(users[i]);
    }
  }
  return result;
}

function findUsersByAge(users: User[], minAge: number, maxAge: number): User[] {
  const result: User[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= minAge && users[i].age <= maxAge) {
      result.push(users[i]);
    }
  }
  return result;
}

function findUsersByEmail(users: User[], emailDomain: string): User[] {
  const result: User[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.endsWith("@" + emailDomain)) {
      result.push(users[i]);
    }
  }
  return result;
}

// Deeply nested callback hell
function processUserRegistration(
  userData: Partial<User>,
  callback: (error: Error | null, user?: User) => void
) {
  const validator = UserValidator.getInstance();
  const errors = validator.validate(userData);

  if (errors.length > 0) {
    callback(new Error(errors.join(", ")));
  } else {
    checkEmailExists(userData.email!, (emailError, exists) => {
      if (emailError) {
        callback(emailError);
      } else {
        if (exists) {
          callback(new Error("Email already exists"));
        } else {
          const factory = UserFactory.getInstance();
          const user = factory.createUser(
            userData.name!,
            userData.email!,
            userData.age!,
            userData.role!
          );
          saveUser(user, (saveError, savedUser) => {
            if (saveError) {
              callback(saveError);
            } else {
              sendWelcomeEmail(savedUser!, (emailErr) => {
                if (emailErr) {
                  console.log("Failed to send welcome email but user was created");
                  callback(null, savedUser);
                } else {
                  updateUserStats("registration", (statsErr) => {
                    if (statsErr) {
                      console.log("Failed to update stats but user was created");
                    }
                    callback(null, savedUser);
                  });
                }
              });
            }
          });
        }
      }
    });
  }
}

function checkEmailExists(
  email: string,
  callback: (error: Error | null, exists?: boolean) => void
) {
  setTimeout(() => {
    callback(null, false);
  }, 100);
}

function saveUser(
  user: User,
  callback: (error: Error | null, user?: User) => void
) {
  setTimeout(() => {
    callback(null, user);
  }, 100);
}

function sendWelcomeEmail(
  user: User,
  callback: (error: Error | null) => void
) {
  setTimeout(() => {
    callback(null);
  }, 100);
}

function updateUserStats(
  action: string,
  callback: (error: Error | null) => void
) {
  setTimeout(() => {
    callback(null);
  }, 100);
}

// Redundant data transformation - does too many passes over data
function generateUserReport(users: User[]): string {
  const activeUsers: User[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].isActive) {
      activeUsers.push(users[i]);
    }
  }

  const names: string[] = [];
  for (let i = 0; i < activeUsers.length; i++) {
    names.push(activeUsers[i].name);
  }

  const emails: string[] = [];
  for (let i = 0; i < activeUsers.length; i++) {
    emails.push(activeUsers[i].email);
  }

  const roles: string[] = [];
  for (let i = 0; i < activeUsers.length; i++) {
    roles.push(activeUsers[i].role);
  }

  const roleCounts: Record<string, number> = {};
  for (let i = 0; i < roles.length; i++) {
    if (roleCounts[roles[i]]) {
      roleCounts[roles[i]]++;
    } else {
      roleCounts[roles[i]] = 1;
    }
  }

  let report = "User Report\n";
  report += "===========\n";
  report += "Total Users: " + users.length + "\n";
  report += "Active Users: " + activeUsers.length + "\n";
  report += "\nRole Distribution:\n";

  const roleKeys = Object.keys(roleCounts);
  for (let i = 0; i < roleKeys.length; i++) {
    report += "  " + roleKeys[i] + ": " + roleCounts[roleKeys[i]] + "\n";
  }

  report += "\nUser List:\n";
  for (let i = 0; i < activeUsers.length; i++) {
    report += "  " + names[i] + " (" + emails[i] + ") - " + roles[i] + "\n";
  }

  return report;
}

// Copy-pasted formatting functions with slight variations
function formatUserForDisplay(user: User): string {
  let result = "";
  result += "Name: " + user.name + "\n";
  result += "Email: " + user.email + "\n";
  result += "Age: " + user.age + "\n";
  result += "Role: " + user.role + "\n";
  result += "Active: " + (user.isActive ? "Yes" : "No") + "\n";
  result += "Created: " + user.createdAt.toISOString() + "\n";
  result += "Updated: " + user.updatedAt.toISOString() + "\n";
  return result;
}

function formatUserForLog(user: User): string {
  let result = "";
  result += "name=" + user.name + " ";
  result += "email=" + user.email + " ";
  result += "age=" + user.age + " ";
  result += "role=" + user.role + " ";
  result += "active=" + (user.isActive ? "true" : "false") + " ";
  result += "created=" + user.createdAt.toISOString() + " ";
  result += "updated=" + user.updatedAt.toISOString();
  return result;
}

function formatUserForCsv(user: User): string {
  let result = "";
  result += user.name + ",";
  result += user.email + ",";
  result += user.age + ",";
  result += user.role + ",";
  result += (user.isActive ? "true" : "false") + ",";
  result += user.createdAt.toISOString() + ",";
  result += user.updatedAt.toISOString();
  return result;
}

function formatUserForJson(user: User): string {
  return JSON.stringify({
    name: user.name,
    email: user.email,
    age: user.age,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
}

// Overly complex permission checking
function canUserPerformAction(user: User, action: string, target: string): boolean {
  if (user.role === "admin") {
    if (action === "read") { return true; }
    if (action === "write") { return true; }
    if (action === "delete") { return true; }
    if (action === "manage") { return true; }
  }

  if (user.role === "moderator") {
    if (action === "read") { return true; }
    if (action === "write") {
      if (target === "posts") { return true; }
      if (target === "comments") { return true; }
      if (target === "reports") { return true; }
      return false;
    }
    if (action === "delete") {
      if (target === "comments") { return true; }
      if (target === "reports") { return true; }
      return false;
    }
    if (action === "manage") { return false; }
  }

  if (user.role === "user") {
    if (action === "read") {
      if (target === "posts") { return true; }
      if (target === "comments") { return true; }
      if (target === "profile") { return true; }
      return false;
    }
    if (action === "write") {
      if (target === "comments") { return true; }
      if (target === "profile") { return true; }
      return false;
    }
    if (action === "delete") { return false; }
    if (action === "manage") { return false; }
  }

  return false;
}

// Unnecessary intermediate variables and redundant checks
function updateUserProfile(user: User, updates: Partial<User>): User {
  const currentName = user.name;
  const currentEmail = user.email;
  const currentAge = user.age;
  const currentRole = user.role;
  const currentIsActive = user.isActive;
  const currentPreferences = user.preferences;

  const newName = updates.name !== undefined ? updates.name : currentName;
  const newEmail = updates.email !== undefined ? updates.email : currentEmail;
  const newAge = updates.age !== undefined ? updates.age : currentAge;
  const newRole = updates.role !== undefined ? updates.role : currentRole;
  const newIsActive = updates.isActive !== undefined ? updates.isActive : currentIsActive;
  const newPreferences = updates.preferences !== undefined ? updates.preferences : currentPreferences;

  if (newEmail !== currentEmail) {
    if (!validateEmail(newEmail)) {
      throw new Error("Invalid email");
    }
  }

  const updatedUser: User = {
    id: user.id,
    name: newName,
    email: newEmail,
    age: newAge,
    role: newRole,
    createdAt: user.createdAt,
    updatedAt: new Date(),
    isActive: newIsActive,
    preferences: newPreferences,
  };

  return updatedUser;
}

// Sorting that reimplements what Array.sort does
function sortUsersByName(users: User[]): User[] {
  const sorted = [...users];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i].name.toLowerCase() > sorted[j].name.toLowerCase()) {
        const temp = sorted[i];
        sorted[i] = sorted[j];
        sorted[j] = temp;
      }
    }
  }
  return sorted;
}

function sortUsersByAge(users: User[]): User[] {
  const sorted = [...users];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i].age > sorted[j].age) {
        const temp = sorted[i];
        sorted[i] = sorted[j];
        sorted[j] = temp;
      }
    }
  }
  return sorted;
}

function sortUsersByCreatedAt(users: User[]): User[] {
  const sorted = [...users];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i].createdAt.getTime() > sorted[j].createdAt.getTime()) {
        const temp = sorted[i];
        sorted[i] = sorted[j];
        sorted[j] = temp;
      }
    }
  }
  return sorted;
}

export {
  User, UserPreferences, UserValidator, UserFactory,
  validateEmail, validateUserEmail, isValidEmail,
  findUsersByRole, findActiveUsers, findUsersByAge, findUsersByEmail,
  processUserRegistration, generateUserReport,
  formatUserForDisplay, formatUserForLog, formatUserForCsv, formatUserForJson,
  canUserPerformAction, updateUserProfile,
  sortUsersByName, sortUsersByAge, sortUsersByCreatedAt,
};
