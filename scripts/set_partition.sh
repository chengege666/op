#!/bin/bash
# scripts/set_partition.sh
# Usage: FIRMWARE_SIZE=256 ./scripts/set_partition.sh

if [ -z "${FIRMWARE_SIZE}" ]; then
    echo "FIRMWARE_SIZE is not set, skipping..."
    exit 0
fi

echo "Setting partition size to ${FIRMWARE_SIZE}MB..."
# If it exists, replace it
if grep -q "CONFIG_TARGET_ROOTFS_PARTSIZE=" .config; then
    sed -i "s/CONFIG_TARGET_ROOTFS_PARTSIZE=[0-9]*/CONFIG_TARGET_ROOTFS_PARTSIZE=${FIRMWARE_SIZE}/" .config
else
    # If not, append it
    echo "CONFIG_TARGET_ROOTFS_PARTSIZE=${FIRMWARE_SIZE}" >> .config
fi
