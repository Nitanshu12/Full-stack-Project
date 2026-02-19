#!/bin/bash

echo "🚀 Creating EC2 instance..."

INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0136735c2bb5cf5bf \
  --instance-type t3.micro \
  --key-name vockey \
  --security-groups launch-wizard-2 \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=MUbuntu-CLI-VM}]" \
  --query "Instances[0].InstanceId" \
  --output text)

if [ "$INSTANCE_ID" != "None" ]; then
  echo "✅ EC2 Instance created successfully"
  echo "🆔 Instance ID: $INSTANCE_ID"
else
  echo "❌ EC2 creation failed"
fi






