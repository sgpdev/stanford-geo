until sudo npm run start; do
    echo "Server 'sgp-search' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done