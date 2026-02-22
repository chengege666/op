#!/bin/bash
# scripts/set_ip.sh
# Usage: LAN_IP=192.168.1.1 ./scripts/set_ip.sh

if [ -z "${LAN_IP}" ]; then
    echo "LAN_IP is not set, skipping..."
    exit 0
fi

echo "Setting LAN IP to ${LAN_IP}..."
# Use uci-defaults for runtime configuration
mkdir -p files/etc/uci-defaults
cat > files/etc/uci-defaults/99-custom-ip <<EOF
uci set network.lan.ipaddr='${LAN_IP}'
uci commit network
EOF
chmod +x files/etc/uci-defaults/99-custom-ip
