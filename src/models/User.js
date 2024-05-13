import { formatDate } from "../helpers/helper.js";

class User {
  constructor(userUID, firstName, lastName, username) {
    this.userUID = userUID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.age = null;
    this.city = null;
    this.address = null;
    this.phoneNumber = null;
    this.role = "user";
    this.createdAt = new Date();
  }

  toObject() {
    return {
      userUID: this.userUID,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      age: this.age,
      city: this.city,
      address: this.address,
      phoneNumber: this.phoneNumber,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  static getProfile(doc) {
    const data = doc.data();
    const user = new User(
      data.userUID,
      data.firstName,
      data.lastName,
      data.username
    );
    user.id = doc.id;
    user.age = data.age;
    user.city = data.city;
    user.address = data.address;
    user.phoneNumber = data.phoneNumber;
    user.role = data.role;
    user.password = undefined;
    user.createdAt = formatDate(data.createdAt);
    return user;
  }
}

export default User;
