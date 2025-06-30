#!/bin/sh
set -e

: "${MONGO_INITDB_ROOT_USERNAME:?MONGO_INITDB_ROOT_USERNAME not set}"
: "${MONGO_INITDB_ROOT_PASSWORD:?MONGO_INITDB_ROOT_PASSWORD not set}"
: "${MONGODB_REPLICA_SET:?MONGODB_REPLICA_SET not set}"
: "${MONGODB_REPLICA_SET_HOST:?MONGODB_REPLICA_SET_HOST not set}"
: "${MONGODB_PORT:?MONGODB_PORT not set}"
: "${MONGODB_DATABASE_AUTH_NAME:?MONGODB_DATABASE_AUTH_NAME not set}"

KEYFILE=/etc/mongo.key

echo "MONGO_INITDB_ROOT_USERNAME: $MONGO_INITDB_ROOT_USERNAME"
echo "MONGO_INITDB_ROOT_PASSWORD: $MONGO_INITDB_ROOT_PASSWORD"
echo "MONGODB_REPLICA_SET: $MONGODB_REPLICA_SET"
echo "MONGODB_REPLICA_SET_HOST: $MONGODB_REPLICA_SET_HOST"
echo "MONGODB_PORT: $MONGODB_PORT"
echo "MONGODB_DATABASE_AUTH_NAME: $MONGODB_DATABASE_AUTH_NAME"

if [ ! -f "$KEYFILE" ]; then
  echo "🔐 Генерируем keyfile внутри контейнера..."
  head -c 756 /dev/urandom | base64 > "$KEYFILE"
  chmod 600 "$KEYFILE"
  echo "✅ Keyfile создан: $KEYFILE"
fi

echo "🚀 Запуск mongod init с --replSet, без auth..."
mongod --replSet "${MONGODB_REPLICA_SET}" --bind_ip_all --port "${MONGODB_PORT}" --dbpath /data/db --fork --logpath /tmp/mongod-init.log

echo "⏳ Ждем, пока mongod init будет доступен..."
timeout=15
while ! mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
  timeout=$((timeout - 1))
  if [ "$timeout" -le 0 ]; then
    echo "❌ mongod init не отвечает"
    pkill mongod
    exit 1
  fi
done
echo "✅ mongod init поднялся"

echo "🔍 Проверяем состояние replica set и инициализируем с правильными host'ами..."
RS_INIT_CHECK=$(mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --quiet --eval "try { rs.status().ok } catch(e) { 0 }")

if [ "$RS_INIT_CHECK" != "1" ]; then
  echo "🧱 Инициализируем replica set с host'ом: ${MONGODB_REPLICA_SET_HOST}:${MONGODB_PORT}..."
  mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --eval "
		rs.initiate({
			_id: '${MONGODB_REPLICA_SET}',
			members: [
				{ _id: 0, host: '${MONGODB_REPLICA_SET_HOST}:${MONGODB_PORT}' }
			]
		});
  "
  echo "✅ Replica set инициализирован"
else
  echo "ℹ️ Replica set уже инициализирован"
fi

echo "⏳ Ждем, пока node станет PRIMARY..."
timeout=30
while true; do
  PRIMARY=$(mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --quiet --eval "rs.isMaster().ismaster" || echo "false")
  echo "Текущее состояние PRIMARY: $PRIMARY"
  if [ "$PRIMARY" = "true" ]; then
    echo "✅ Node стал PRIMARY"
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
  if [ "$timeout" -le 0 ]; then
    echo "❌ Таймаут ожидания PRIMARY"
    exit 1
  fi
done

EXISTS=$(mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --quiet --eval "db.getSiblingDB('${MONGODB_DATABASE_AUTH_NAME}').system.users.find({user:'${MONGO_INITDB_ROOT_USERNAME}'}).count()")
if [ "$EXISTS" -eq 0 ]; then
  echo "👤 Создаем администратора..."
  mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" "${MONGODB_DATABASE_AUTH_NAME}" --eval "db.createUser({user:'${MONGO_INITDB_ROOT_USERNAME}', pwd:'${MONGO_INITDB_ROOT_PASSWORD}', roles:[{role:'root', db:'${MONGODB_DATABASE_AUTH_NAME}'}]});"
  echo "✅ Администратор создан"
else
  echo "ℹ️ Администратор уже существует"
fi

echo "🔄 Останавливаем mongod init..."
mongosh --host "127.0.0.1" --port "${MONGODB_PORT}" --eval "db.getSiblingDB('admin').shutdownServer()" || true
sleep 5

echo "🔐 Запуск mongod с auth, replSet и keyFile..."
exec mongod \
  --replSet "${MONGODB_REPLICA_SET}" \
  --auth \
  --keyFile "$KEYFILE" \
  --bind_ip_all \
  --port "${MONGODB_PORT}" \
  --dbpath /data/db
