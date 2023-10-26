import admin from "firebase-admin";
import serviceAccount from "../serviceAccount.json" assert { type: "json" };

admin.initializeApp({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://real-world-games-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();
const ref = db.ref("idea-submitter/data");

// Create a query that only listens for new items
const query = ref.orderByChild("timestamp").startAt(Date.now());

const getUser = async (uid?: string) => {
  if (uid == null) return null;
  return await admin.auth().getUser(uid);
};

query.on("child_added", async (snapshot) => {
  process.stdout.write("new message: ");
  const { value, user: userId } = snapshot.val();
  if (value == null || typeof value != "string") {
    process.stdout.write("value is empty\n");
    return;
  }
  process.stdout.write(`${value}`);

  // get the user if its a authed request
  const user = await getUser(userId);

  if (user?.displayName) {
    process.stderr.write(` | ${user?.displayName}`);
  }

  process.stdout.write("\n");
});

// This will keep the process running until you manually exit it
process.stdin.resume();
