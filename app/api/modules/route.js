import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export async function GET() {
  try {
    const modulesRef = collection(db, "modules");
    const snapshot = await getDocs(modulesRef);

    let modules = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      modules.push({
        id: doc.id,
        addedOn: data.addedOn.toDate(),
        language: data.language,
        name: data.name,
        questionsOrder: data.questionsOrder,
      });
    });

    return Response.json({ success: true, modules });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
