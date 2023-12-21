cd /home/ubuntu/TriGuardBackend

ps -ef | grep TriGuardBackend | grep -v grep | awk '{print $2}' | xargs kill -SIGTERM

echo "Successfully kill the old process"

sleep 5

if [ -f console.log ]; then
    rm console.log
fi

echo "Successfully remove the old console.log"

java -jar TriGuardBackend-0.0.1-SNAPSHOT.jar > console.log &

echo "Successfully start backend"

exit 0