import { AuthService } from "../../services/auth-service";

export async function signup(formData: FormData) {
  // In a real app, you would validate the data and create a user in your database
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  try {
    const data = await AuthService.signup({
      firstName,
      lastName,
      email,
      phone,
      password,
    });
    if (data.status) {
      return { user: data.user };
    } else {
      return { error: data.message };
    }
  } catch (e) {
    console.log(e)
    return { error: "Internal Server Error" };
  }
}

export async function login(formData: FormData) {
  // In a real app, you would validate credentials against your database
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const data = await AuthService.login({ email, password });
    if (data.status) {
      return { user: data.user };
    } else {
      return { error: data.message };
    }
  } catch (e) {
    console.log(e)
    return { error: "Internal Server Error" };
  }
}

export async function logout() {
  await AuthService.logout();
}
