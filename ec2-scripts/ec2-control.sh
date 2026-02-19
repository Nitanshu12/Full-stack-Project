#!/bin/bash

INSTANCE_ID="i-0f0866f1d35c4bdda"

ACTION=$1

if [ "$ACTION" = "start" ]; then
  echo "[INFO] Requesting Start for $INSTANCE_ID..."
  aws ec2 start-instances --instance-ids "$INSTANCE_ID"

elif [ "$ACTION" = "stop" ]; then
  echo "[INFO] Requesting Stop for $INSTANCE_ID..."
  aws ec2 stop-instances --instance-ids "$INSTANCE_ID"

else
  echo "[ERROR] Usage: ./ec2-control.sh start | stop"
fi

