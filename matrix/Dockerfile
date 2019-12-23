FROM ubuntu:18.04
RUN apt update \
&& apt upgrade \
&& apt install -y file gcc git libevent-dev libffi-dev libgnutls28-dev libssl-dev libldap2-dev \
 libsasl2-dev libsqlite3-dev libssl-dev libtool libxml2-dev libxslt1-dev \
 make zlib1g-dev libpq-dev build-essential python3-dev libffi-dev python3-pip \
 python3-setuptools sqlite3 libssl-dev python-psycopg2 python3-virtualenv libjpeg-dev libxslt1-dev curl xmlsec1 && \
pip3 --version && \
pip3 install --upgrade wheel; \
pip3 install --upgrade virtualenv; \
pip3 install --upgrade setuptools; \
pip3 install --upgrade psycopg2; \
pip3 install --upgrade python-ldap; \
pip3 install --upgrade lxml; \
pip3 install pysaml2; \
pip3 install matrix-synapse
RUN mkdir -p ~/synapse
RUN virtualenv -p python3 ~/synapse/env
COPY entrypoint.sh /entrypoint.sh
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
WORKDIR /root/synapse
EXPOSE 80
ENTRYPOINT ["/tini", "--", "/entrypoint.sh"]
