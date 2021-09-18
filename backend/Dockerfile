FROM node:14

# アプリケーションディレクトリを作成する
WORKDIR /usr/src/app

# Copy application dependencies
COPY api/package*.json ./

RUN npm install 
# For production
# RUN npm install --only=production

COPY ./api/src ./

EXPOSE 3000
CMD [ "node", "server.js" ]