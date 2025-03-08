// import { BACKEND } from "../utils";
// // import dotenv from "dotenv";
// // dotenv.config({ path: "../../.env" });
declare global {
  interface Window {
    Twitch: any;
  }
}

// // export let username: string;

// // On loading of the extension, get the user's username and store the info in the database
// // Can run at any time during the application
// // interface Auth {
// //   token: string;
// //   helixToken: string;
// //   channelId: string;
// //   clientId: string;
// //   userId: string;
// // }

window.Twitch.ext.onAuthorized(function () {
  console.log("onAuthorized");
  return;
  // Turns out you can't get the user's username from the Twitch API using a user JWT token
  // You need an access token, but I don't want to make the user deal with oauth
  // So I'll just allow them to type their names in
  // console.log(auth);
  // const oauthToken = auth.helixToken;
  // console.log(oauthToken);
  // const clientId = auth.clientId; // Replace with your Twitch client ID
  // const userId = auth.userId;
  // console.log(userId);
  // fetch("https://api.twitch.tv/helix/users", {
  //   method: "GET",
  //   headers: {
  //     "client-id": clientId!,
  //     Authorization: `Extension ${oauthToken}`,
  //   },
  //   // mode: "cors",
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.data && data.data.length > 0) {
  //       const username = data.data[0].login; // Twitch username
  //       console.log("Fetched username:", username);
  //       // Send the username to your backend to create the user account
  //       createUserAccount(username);
  //     } else {
  //       console.error("Error fetching Twitch user data:", data);
  //     }
  //   })
  //   .catch((err) => {
  //     console.error("Error fetching user info:", err);
  //   });
});

// // testing bypass function
// // export function addUser() {
// //   username = "user" + Math.floor(Math.random() * 10000).toString();
// //   console.log("Adding user:", username);
// //   const formData = new FormData();
// //   formData.append("username", username);

// //   fetch(BACKEND + "/create_player", {
// //     method: "POST",
// //     body: formData,
// //   })
// //     .then((response) => response.json())
// //     .then((data) => {
// //       console.log("User added:", data);
// //     })
// //     .catch((error) => {
// //       console.error("Error adding user:", error);
// //     });
// // }
