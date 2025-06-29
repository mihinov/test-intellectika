import { MongoClient } from "mongodb";

async function checkReplicaSetConnection(uri) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log("Подключение к MongoDB успешно");

    const adminDb = client.db().admin();

    const replStatus = await adminDb.command({ replSetGetStatus: 1 });
    console.log("Статус replica set:");
    console.dir(replStatus, { depth: 3 });

    const primaryMember = replStatus.members.find(m => m.stateStr === "PRIMARY");
    if (primaryMember) {
      console.log(`PRIMARY: ${primaryMember.name}`);
    } else {
      console.log("PRIMARY не найден");
    }
  } catch (error) {
    console.error("Ошибка подключения или запроса к MongoDB:", error);
  } finally {
    await client.close();
  }
}

const uri = "mongodb://admin:password@127.0.0.1:29017/intellectika-5?authSource=admin&replicaSet=rs0";

checkReplicaSetConnection(uri);
