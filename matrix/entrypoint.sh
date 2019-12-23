#!/bin/sh
mkdir /root/synapse/saml2_attribute_maps/
mkdir /root/synapse/config/

cp /etc/secrets/homeserver.yaml /data/homeserver.yaml
cp /etc/secrets/matrix.cachednerds.com.log.config /data/matrix.cachednerds.com.log.config
cp /etc/secrets/matrix.cachednerds.com.signing.key /data/matrix.cachednerds.com.signing.key

# SAML key and certificate
cp /etc/secrets/key.pem /root/synapse/config/key.pem
cp /etc/secrets/cert.pem /root/synapse/config/cert.pem
cp /etc/secrets/idp.xml /root/synapse/config/idp.xml
cp /etc/secrets/map.py /root/synapse/saml2_attribute_maps/map.py
cp /etc/secrets/sp_conf.py /root/synapse/config/sp_conf.py

mv /data/homeserver.yaml ~/synapse

chmod -R 777 /data

cd /root/synapse && . /root/synapse/env/bin/activate

synctl start --no-daemonize
