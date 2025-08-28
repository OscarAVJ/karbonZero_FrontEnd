import { APIURL } from "../../utils/api_url";

export async function validateLogin(email, password) {
  try {
    const response = await fetch(
      `${APIURL}apiUser/loginUser?email=${email}&password=${password}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      console.error("Error validating user");
    }

    return response.json();
  } catch (err) {
    console.error(`Error validating user: ${err}`);
    throw err;
  }
}

export async function getUserByEmail(email) {
  try {
    const response = await fetch(`${APIURL}apiUser/getUserByEmail/${email}`);
    if (!response.ok) {
      console.error("Error fetching user");
    }
    return response.json();
  } catch (err) {
    console.error(`Error fetching user: ${err}`);
    throw err;
  }
}
