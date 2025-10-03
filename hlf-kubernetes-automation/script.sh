#!/bin/bash

# Set namespace
NAMESPACE="hacker-company"

# Create 'application' secret with key 'checksum' and value from environment variable 'APPLICATION_CHECKSUM'
kubectl create secret generic application \
  --from-literal=checksum="${APPLICATION_CHECKSUM}" \
  -n "$NAMESPACE"

# Create 'deployment' secret with key 'ssh_key' and value from file '/id_rsa.pub'
kubectl create secret generic deployment \
  --from-file=ssh_key=/id_rsa.pub \
  -n "$NAMESPACE"
