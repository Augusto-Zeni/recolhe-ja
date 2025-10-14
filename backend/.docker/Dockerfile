FROM node:22

ARG HOST_UID
ARG HOST_GID

RUN groupadd -g ${HOST_GID} appgroup
RUN useradd -m -u ${HOST_UID} -g ${HOST_GID} appuser

WORKDIR /app

RUN npm install -g npm@11.6.2
RUN npm -g install @nestjs/cli

USER appuser

EXPOSE 3000