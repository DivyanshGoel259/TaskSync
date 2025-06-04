import { userModel } from "../models/user.model";

interface UserType {
  name: string;
  password: string;
  email: string;
  role: Role;
}
enum Role {
  manager = "Manager",
  employee = "Employee",
}

export const register = async ({ name, password, email, role }: UserType) => {
  try {
    if (!name || !password || !email || !role) {
      throw new Error("All feilds are Required");
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    // Save user to database
    const savedUser = await user.save();
    const userObj = savedUser.toObject();
    delete userObj.password;

    const token = savedUser.generateAuthToken();

    return { token, user: userObj };
  } catch (err) {
    throw err;
  }
};

export const login = async ({
  password,
  email,
}: Pick<UserType, "email" | "password">) => {
  try {
    if (!password || !email) {
      throw new Error("All feilds are Required");
    }

    const user = await userModel.findOne({ email: email }).select("+password");
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = user.generateAuthToken();
    const userObj = user.toObject();
    delete userObj.password;
    return { token, user: userObj };
  } catch (err) {
    throw err;
  }
};
