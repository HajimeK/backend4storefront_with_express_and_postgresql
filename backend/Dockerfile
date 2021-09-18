FROM node:14

# md & cd workdir
WORKDIR /usr/app

# Copy application dependencies
COPY api/package*.json ./
COPY ./api/src ./

RUN npm install 
# For production
# RUN npm install --only=production


EXPOSE 3000
CMD [ "npm", "watch" ]