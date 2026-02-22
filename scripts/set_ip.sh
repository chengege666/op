#!/bin/bash
# scripts/set_ip.sh
# Usage: LAN_IP=192.168.1.1 ./scripts/set_ip.sh

if [ -z "${LAN_IP}" ]; then
    echo "LAN_IP is not set, skipping..."
    exit 0
fi

echo "Setting LAN IP to ${LAN_IP}..."
sed -i "s/192.168.1.1/${LAN_IP}/g" package/base-files/files/bin/config_generate
