#!/bin/bash
# scripts/add_docker.sh
# Usage: ENABLE_DOCKER=true ./scripts/add_docker.sh

if [ "${ENABLE_DOCKER}" != "true" ]; then
    echo "Docker integration disabled, skipping..."
    exit 0
fi

echo "Adding Docker packages to .config..."
cat >> .config <<EOF
CONFIG_PACKAGE_dockerd=y
CONFIG_PACKAGE_docker=y
CONFIG_PACKAGE_luci-app-dockerman=y
CONFIG_PACKAGE_cgroupfs-mount=y
EOF
