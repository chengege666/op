#!/bin/bash
# scripts/add_store.sh
# Usage: ENABLE_STORE=true ./scripts/add_store.sh

if [ "${ENABLE_STORE}" != "true" ]; then
    echo "Store integration disabled, skipping..."
    exit 0
fi

echo "Adding Store feed..."
echo "src-git istore https://github.com/linkease/istore;main" >> feeds.conf.default
./scripts/feeds update istore
./scripts/feeds install -a -p istore

echo "Adding Store package to .config..."
cat >> .config <<EOF
CONFIG_PACKAGE_luci-app-store=y
EOF
