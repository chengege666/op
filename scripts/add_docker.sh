#!/bin/bash
# scripts/add_docker.sh
# Usage: ENABLE_DOCKER=true ./scripts/add_docker.sh

if [ "${ENABLE_DOCKER}" != "true" ]; then
    exit 0
fi

# For Image Builder, we just need to list packages
echo "dockerd docker luci-app-dockerman cgroupfs-mount" >> custom_packages.txt
