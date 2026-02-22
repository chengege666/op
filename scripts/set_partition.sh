#!/bin/bash
# scripts/set_partition.sh
# Usage: FIRMWARE_SIZE=256 ./scripts/set_partition.sh

if [ -z "${FIRMWARE_SIZE}" ]; then
    exit 0
fi

# For Image Builder, we modify the .config file directly
sed -i "s/CONFIG_TARGET_ROOTFS_PARTSIZE=[0-9]*/CONFIG_TARGET_ROOTFS_PARTSIZE=${FIRMWARE_SIZE}/" .config
