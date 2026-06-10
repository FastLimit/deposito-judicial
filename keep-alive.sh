#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "next dev -p 3000" > /dev/null 2>&1; then
    echo "$(date): Starting next dev..." >> /tmp/keep-alive.log
    rm -f .next/dev/lock
    node node_modules/.bin/next dev -p 3000 >> /tmp/keep-alive.log 2>&1 &
    sleep 5
  fi
  sleep 5
done
