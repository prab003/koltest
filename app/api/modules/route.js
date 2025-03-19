import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function GET() {
  console.log("Fetching modules...");

  try {
    const modulesRef = collection(db, "modules");
    console.log("Modules collection reference:", modulesRef);

    const snapshot = await getDocs(modulesRef);
    console.log("Snapshot size:", snapshot.size);

    let modules = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Document data:", data);

      modules.push({
        id: doc.id,
        addedOn: data.addedOn?.toDate(),
        language: data.language,
        name: data.name,
        questionsOrder: data.questionsOrder,
      });
    });

    console.log(modules, "Fetched modules from Firestore");

    return new Response(JSON.stringify({ success: true, modules }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
