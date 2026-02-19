#!/bin/bash

# ================================
# Safe EC2 Control Script
# Phase 2: Idempotent Operations
# ================================

INSTANCE_ID="i-0f0866f1d35c4bdda"
ACTION=$1

# Validate input
if [ -z "$ACTION" ]; then
  echo "[ERROR] Usage: ./safe-ec2-control.sh start | stop"
  exit 1
fi

# Scout: Get current instance state
CURRENT_STATE=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].State.Name" \
  --output text)

echo "[INFO] Current State: $CURRENT_STATE"

# Logic
if [ "$ACTION" = "start" ]; then

  if [ "$CURRENT_STATE" = "running" ]; then
    echo "[SKIP] Instance is already running."
  else
    echo "[ACTION] Starting instance $INSTANCE_ID..."
    aws ec2 start-instances --instance-ids "$INSTANCE_ID"
  fi

elif [ "$ACTION" = "stop" ]; then

  if [ "$CURRENT_STATE" = "stopped" ]; then
    echo "[SKIP] Instance is already stopped."
  else
    echo "[ACTION] Stopping instance $INSTANCE_ID..."
    aws ec2 stop-instances --instance-ids "$INSTANCE_ID"
  fi

else
  echo "[ERROR] Invalid action: $ACTION"
  echo "Use: start or stop"
  exit 1
fi

