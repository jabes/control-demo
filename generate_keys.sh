#!/usr/bin/env bash

rm -rf keys
mkdir keys

openssl req -x509 -nodes -days 365 -newkey rsa:2048  \
    -subj "/C=CA/ST=BC/L=Vancouver/O=None/OU=None/CN=localhost/emailAddress=None" \
    -keyout keys/key.pem  -out keys/cert.pem
