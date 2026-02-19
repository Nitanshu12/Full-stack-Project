#!/bin/bash

# ================================
# EC2 Health Check Script
# Phase 3: Vital Signs Monitor
# ================================

INSTANCE_ID="i-0f0866f1d35c4bdda"

# Fetch instance state
INSTANCE_STATE=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --query "Reservations[0].Instances[0].State.Name" \
  --output text)

# Fetch system status
SYSTEM_STATUS=$(aws ec2 describe-instance-status \
  --instance-ids "$INSTANCE_ID" \
  --query "InstanceStatuses[0].SystemStatus.Status" \
  --output text)

# Fetch instance status
INSTANCE_STATUS=$(aws ec2 describe-instance-status \
  --instance-ids "$INSTANCE_ID" \
  --query "InstanceStatuses[0].InstanceStatus.Status" \
  --output text)

# Handle stopped instance (no health data)
if [ "$SYSTEM_STATUS" = "None" ] || [ "$INSTANCE_STATUS" = "None" ]; then
  HEALTH="[N/A]"
else
  if [ "$SYSTEM_STATUS" = "ok" ] && [ "$INSTANCE_STATUS" = "ok" ]; then
    HEALTH="[OK]"
  else
    HEALTH="[ALERT]"
  fi
fi

# Output formatted report
echo "-----------------------------"
echo "Instance ID: $INSTANCE_ID"
echo "State:       $INSTANCE_STATE"
echo "Health:      $HEALTH"
echo "-----------------------------"

if [ "$HEALTH" = "[ALERT]" ]; then
  echo "[ALERT] Check System!"
fi

